import { useEffect, useRef, memo, useState, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  fps: number;
  loadTime: number;
}

interface PerformanceMonitorProps {
  componentName: string;
  onMetrics?: (metrics: PerformanceMetrics) => void;
  enabled?: boolean;
}

export const PerformanceMonitor = memo(({ 
  componentName, 
  onMetrics, 
  enabled = process.env.NODE_ENV === 'development' 
}: PerformanceMonitorProps) => {
  const renderStartTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const lastFrameTime = useRef<number>(0);
  const loadStartTime = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    loadStartTime.current = performance.now();
    renderStartTime.current = performance.now();

    // FPS monitoring
    let animationFrameId: number;
    const measureFPS = (currentTime: number) => {
      frameCount.current++;
      
      if (currentTime - lastFrameTime.current >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / (currentTime - lastFrameTime.current));
        frameCount.current = 0;
        lastFrameTime.current = currentTime;
        
        // Log FPS if it's low
        if (fps < 30) {
          console.warn(`${componentName} low FPS detected: ${fps}`);
        }
      }
      
      animationFrameId = requestAnimationFrame(measureFPS);
    };
    
    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [componentName, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const renderTime = performance.now() - renderStartTime.current;
    const loadTime = performance.now() - loadStartTime.current;

    // Memory usage (if available)
    let memoryUsage: number | undefined;
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
    }

    const metrics: PerformanceMetrics = {
      renderTime,
      memoryUsage,
      fps: 60, // Default, will be updated by FPS monitor
      loadTime,
    };

    // Log performance metrics
    console.log(`${componentName} Performance Metrics:`, {
      renderTime: `${renderTime.toFixed(2)}ms`,
      loadTime: `${loadTime.toFixed(2)}ms`,
      memoryUsage: memoryUsage ? `${memoryUsage.toFixed(2)}MB` : 'N/A',
    });

    // Warn if performance is poor
    if (renderTime > 16) { // 60fps = 16.67ms per frame
      console.warn(`${componentName} slow render detected: ${renderTime.toFixed(2)}ms`);
    }

    if (memoryUsage && memoryUsage > 50) { // 50MB threshold
      console.warn(`${componentName} high memory usage: ${memoryUsage.toFixed(2)}MB`);
    }

    onMetrics?.(metrics);
  }, [componentName, enabled, onMetrics]);

  return null;
});

PerformanceMonitor.displayName = "PerformanceMonitor";

// Virtual scrolling hook for large lists
export const useVirtualScrolling = <T,>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    containerRef,
    totalHeight,
    visibleItems,
    offsetY,
    handleScroll,
    startIndex,
    endIndex,
  };
};

// Debounce hook for performance optimization
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle hook for performance optimization
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          callback(...args);
          lastRun.current = Date.now();
        }, delay - (now - lastRun.current));
      }
    },
    [callback, delay]
  ) as T;
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true);
      }
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options, hasIntersected]);

  return { elementRef, isIntersecting, hasIntersected };
};

// Error boundary hook
export const useErrorBoundary = () => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Error caught by boundary:', event.error);
      setError(event.error);
      setHasError(true);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setError(new Error(event.reason));
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const resetError = useCallback(() => {
    setHasError(false);
    setError(null);
  }, []);

  return { hasError, error, resetError };
};