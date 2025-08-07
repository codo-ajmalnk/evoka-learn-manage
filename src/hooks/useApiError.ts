import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export const useApiError = () => {
  const handleError = useCallback((error: unknown, context?: string) => {
    console.error('API Error:', error, { context });

    let errorMessage = 'An unexpected error occurred';
    let title = 'Error';

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = (error as ApiError).message;
    }

    // Handle specific HTTP status codes
    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as ApiError).status;
      switch (status) {
        case 400:
          title = 'Bad Request';
          break;
        case 401:
          title = 'Unauthorized';
          errorMessage = 'Please log in to continue';
          break;
        case 403:
          title = 'Forbidden';
          errorMessage = 'You don\'t have permission to perform this action';
          break;
        case 404:
          title = 'Not Found';
          errorMessage = 'The requested resource was not found';
          break;
        case 429:
          title = 'Too Many Requests';
          errorMessage = 'Please slow down and try again later';
          break;
        case 500:
          title = 'Server Error';
          errorMessage = 'Something went wrong on our end. Please try again later';
          break;
        case 502:
        case 503:
        case 504:
          title = 'Service Unavailable';
          errorMessage = 'Service is temporarily unavailable. Please try again later';
          break;
        default:
          if (status >= 500) {
            title = 'Server Error';
            errorMessage = 'Something went wrong on our end. Please try again later';
          }
      }
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      title = 'Network Error';
      errorMessage = 'Please check your internet connection and try again';
    }

    toast({
      title,
      description: errorMessage,
      variant: 'destructive',
    });

    return {
      title,
      message: errorMessage,
      originalError: error,
    };
  }, []);

  const isNetworkError = useCallback((error: unknown): boolean => {
    return error instanceof TypeError && error.message.includes('fetch');
  }, []);

  const isServerError = useCallback((error: unknown): boolean => {
    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as ApiError).status;
      return status ? status >= 500 : false;
    }
    return false;
  }, []);

  const isClientError = useCallback((error: unknown): boolean => {
    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as ApiError).status;
      return status ? status >= 400 && status < 500 : false;
    }
    return false;
  }, []);

  return {
    handleError,
    isNetworkError,
    isServerError,
    isClientError,
  };
};