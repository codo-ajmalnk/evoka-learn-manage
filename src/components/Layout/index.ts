// Optimized Layout Components for High-Performance Applications
// Designed to handle large user loads without loading issues

export { default as DashboardLayout } from './DashboardLayout';
export { AppSidebar } from './AppSidebar';
export { ThemeProvider, MemoizedThemeProvider, useTheme } from './ThemeProvider';
export { ThemeToggle } from './ThemeToggle';
export { UserMenu } from './UserMenu';
export { SearchBar } from './SearchBar';
export { 
  PerformanceMonitor, 
  useVirtualScrolling
} from './PerformanceMonitor';

export {
  PerformanceTracker,
  useAdvancedVirtualScrolling,
  LRUCache,
  useMemoryManager,
  useAdvancedDebounce,
  usePerformanceMonitor,
  useBatchState,
  SearchIndex,
  useOptimizedSearch
} from './PerformanceOptimizations';

// Performance optimization utilities
export const LAYOUT_PERFORMANCE_CONFIG = {
  // Caching durations
  USER_CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  THEME_CACHE_DURATION: 1 * 60 * 1000, // 1 minute
  MENU_CACHE_DURATION: 10 * 60 * 1000, // 10 minutes
  
  // Virtual scrolling settings
  VIRTUAL_SCROLL_OVERCAN: 5,
  VIRTUAL_SCROLL_ITEM_HEIGHT: 60,
  
  // Debounce delays
  SEARCH_DEBOUNCE_DELAY: 300,
  SCROLL_THROTTLE_DELAY: 16, // 60fps
  
  // Performance thresholds
  SLOW_RENDER_THRESHOLD: 16, // ms
  HIGH_MEMORY_THRESHOLD: 50, // MB
  LOW_FPS_THRESHOLD: 30,
  
  // Lazy loading settings
  LAZY_LOAD_THRESHOLD: 0.1,
  LAZY_LOAD_ROOT_MARGIN: '50px',
} as const;

// Performance monitoring utilities
export const createPerformanceLogger = (componentName: string) => {
  return {
    logRender: (renderTime: number) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    },
    logMemory: (memoryUsage: number) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} memory usage: ${memoryUsage.toFixed(2)}MB`);
      }
    },
    warnSlowRender: (renderTime: number) => {
      if (renderTime > LAYOUT_PERFORMANCE_CONFIG.SLOW_RENDER_THRESHOLD) {
        console.warn(`${componentName} slow render detected: ${renderTime.toFixed(2)}ms`);
      }
    },
    warnHighMemory: (memoryUsage: number) => {
      if (memoryUsage > LAYOUT_PERFORMANCE_CONFIG.HIGH_MEMORY_THRESHOLD) {
        console.warn(`${componentName} high memory usage: ${memoryUsage.toFixed(2)}MB`);
      }
    },
  };
};

// Error handling utilities
export const createErrorHandler = (componentName: string) => {
  return {
    handleError: (error: Error, context?: string) => {
      console.error(`${componentName} error${context ? ` in ${context}` : ''}:`, error);
      
      // In production, you might want to send this to an error tracking service
      if (process.env.NODE_ENV === 'production') {
        // Example: Sentry.captureException(error);
      }
    },
    handleAsyncError: (error: unknown) => {
      console.error(`${componentName} async error:`, error);
    },
  };
};

// Memory management utilities
export const createMemoryManager = () => {
  const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  return {
    set: (key: string, data: any, ttl: number = LAYOUT_PERFORMANCE_CONFIG.USER_CACHE_DURATION) => {
      cache.set(key, { data, timestamp: Date.now(), ttl });
    },
    get: (key: string) => {
      const item = cache.get(key);
      if (!item) return null;
      
      if (Date.now() - item.timestamp > item.ttl) {
        cache.delete(key);
        return null;
      }
      
      return item.data;
    },
    clear: () => {
      cache.clear();
    },
    clearExpired: () => {
      const now = Date.now();
      for (const [key, item] of cache.entries()) {
        if (now - item.timestamp > item.ttl) {
          cache.delete(key);
        }
      }
    },
  };
};

// Export performance utilities
export const performanceUtils = {
  createPerformanceLogger,
  createErrorHandler,
  createMemoryManager,
  config: LAYOUT_PERFORMANCE_CONFIG,
}; 