import { useState, useCallback } from 'react';
import { useApiError } from './useApiError';
import { apiClient } from '@/utils/apiClient';

interface ApiRequestState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApiRequest = <T = any>() => {
  const [state, setState] = useState<ApiRequestState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { handleError } = useApiError();

  const execute = useCallback(async (
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      let result: T;

      switch (method) {
        case 'GET':
          result = await apiClient.get<T>(endpoint, options);
          break;
        case 'POST':
          result = await apiClient.post<T>(endpoint, data, options);
          break;
        case 'PUT':
          result = await apiClient.put<T>(endpoint, data, options);
          break;
        case 'PATCH':
          result = await apiClient.patch<T>(endpoint, data, options);
          break;
        case 'DELETE':
          result = await apiClient.delete<T>(endpoint, options);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorResult = handleError(error, `${method} ${endpoint}`);
      setState({ data: null, loading: false, error: errorResult.message });
      return null;
    }
  }, [handleError]);

  const get = useCallback((endpoint: string, options?: RequestInit) => 
    execute('GET', endpoint, undefined, options), [execute]);

  const post = useCallback((endpoint: string, data?: any, options?: RequestInit) => 
    execute('POST', endpoint, data, options), [execute]);

  const put = useCallback((endpoint: string, data?: any, options?: RequestInit) => 
    execute('PUT', endpoint, data, options), [execute]);

  const patch = useCallback((endpoint: string, data?: any, options?: RequestInit) => 
    execute('PATCH', endpoint, data, options), [execute]);

  const del = useCallback((endpoint: string, options?: RequestInit) => 
    execute('DELETE', endpoint, undefined, options), [execute]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    get,
    post,
    put,
    patch,
    delete: del,
    reset,
  };
};