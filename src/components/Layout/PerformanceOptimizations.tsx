import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

// Advanced performance monitoring
export class PerformanceTracker {
  private static instance: PerformanceTracker;
  private metrics: Map<string, number[]> = new Map();
  private observers: Map<string, (metric: number) => void> = new Map();

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  trackMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);

    // Notify observers
    if (this.observers.has(name)) {
      this.observers.get(name)!(value);
    }

    // Keep only last 100 values
    const values = this.metrics.get(name)!;
    if (values.length > 100) {
      values.splice(0, values.length - 100);
    }
  }

  getAverageMetric(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  getMetricHistory(name: string): number[] {
    return this.metrics.get(name) || [];
  }

  observeMetric(name: string, callback: (metric: number) => void): () => void {
    this.observers.set(name, callback);
    return () => this.observers.delete(name);
  }
}

// Virtual scrolling with dynamic item heights
export const useAdvancedVirtualScrolling = <T>(
  items: T[],
  getItemHeight: (item: T, index: number) => number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemPositions = useRef<number[]>([]);

  // Calculate item positions
  const calculatePositions = useCallback(() => {
    const positions: number[] = [0];
    let currentPosition = 0;

    for (let i = 0; i < items.length; i++) {
      currentPosition += getItemHeight(items[i], i);
      positions.push(currentPosition);
    }

    itemPositions.current = positions;
  }, [items, getItemHeight]);

  // Recalculate positions when items change
  useEffect(() => {
    calculatePositions();
  }, [calculatePositions]);

  // Find visible range
  const findVisibleRange = useCallback(() => {
    const startPosition = scrollTop;
    const endPosition = scrollTop + containerHeight;

    let startIndex = 0;
    let endIndex = items.length - 1;

    // Binary search for start index
    for (let i = 0; i < itemPositions.current.length - 1; i++) {
      if (itemPositions.current[i] <= startPosition && itemPositions.current[i + 1] > startPosition) {
        startIndex = i;
        break;
      }
    }

    // Binary search for end index
    for (let i = startIndex; i < itemPositions.current.length - 1; i++) {
      if (itemPositions.current[i] <= endPosition && itemPositions.current[i + 1] > endPosition) {
        endIndex = i;
        break;
      }
    }

    return {
      startIndex: Math.max(0, startIndex - overscan),
      endIndex: Math.min(items.length - 1, endIndex + overscan)
    };
  }, [scrollTop, containerHeight, overscan, items.length]);

  const { startIndex, endIndex } = findVisibleRange();
  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = itemPositions.current[startIndex] || 0;
  const totalHeight = itemPositions.current[itemPositions.current.length - 1] || 0;

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
    itemPositions: itemPositions.current,
  };
};

// Advanced caching with LRU eviction
export class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, { value: V; timestamp: number }> = new Map();

  constructor(capacity: number = 100) {
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    const item = this.cache.get(key);
    if (item) {
      // Update timestamp for LRU
      this.cache.delete(key);
      this.cache.set(key, { value: item.value, timestamp: Date.now() });
      return item.value;
    }
    return undefined;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Remove oldest item
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, { value, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Memory management with automatic cleanup
export const useMemoryManager = () => {
  const cache = useRef(new LRUCache<string, any>(100));
  const cleanupCallbacks = useRef<Set<() => void>>(new Set());

  const cleanup = useCallback(() => {
    cleanupCallbacks.current.forEach(callback => callback());
    cleanupCallbacks.current.clear();
    cache.current.clear();
  }, []);

  const addCleanupCallback = useCallback((callback: () => void) => {
    cleanupCallbacks.current.add(callback);
    return () => cleanupCallbacks.current.delete(callback);
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    cache: cache.current,
    cleanup,
    addCleanupCallback,
  };
};

// Advanced debouncing with leading/trailing options
export const useAdvancedDebounce = <T>(
  value: T,
  delay: number,
  options: { leading?: boolean; trailing?: boolean } = {}
) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isLeading = useRef(false);

  useEffect(() => {
    const { leading = false, trailing = true } = options;

    if (leading && !isLeading.current) {
      setDebouncedValue(value);
      isLeading.current = true;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (trailing) {
        setDebouncedValue(value);
      }
      isLeading.current = false;
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, options]);

  return debouncedValue;
};

// Intersection Observer with performance optimization
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {},
  callback?: (entry: IntersectionObserverEntry) => void
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
        callback?.(entry);
      });
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options, hasIntersected, callback]);

  return { elementRef, isIntersecting, hasIntersected };
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());
  const tracker = useMemo(() => PerformanceTracker.getInstance(), []);

  useEffect(() => {
    const currentTime = performance.now();
    const renderTime = currentTime - lastRenderTime.current;
    
    renderCount.current++;
    lastRenderTime.current = currentTime;

    tracker.trackMetric(`${componentName}-render-time`, renderTime);
    tracker.trackMetric(`${componentName}-render-count`, renderCount.current);

    // Log performance warnings
    if (renderTime > 16) {
      console.warn(`${componentName} slow render: ${renderTime.toFixed(2)}ms`);
    }

    if (renderCount.current > 100) {
      console.warn(`${componentName} high render count: ${renderCount.current}`);
    }
  });

  return {
    renderCount: renderCount.current,
    averageRenderTime: tracker.getAverageMetric(`${componentName}-render-time`),
    getMetricHistory: (metricName: string) => tracker.getMetricHistory(`${componentName}-${metricName}`),
  };
};

// Batch state updates for better performance
export const useBatchState = <T>(initialState: T) => {
  const [state, setState] = useState<T>(initialState);
  const batchRef = useRef<Partial<T>>({});
  const timeoutRef = useRef<NodeJS.Timeout>();

  const batchUpdate = useCallback((updates: Partial<T>) => {
    Object.assign(batchRef.current, updates);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, ...batchRef.current }));
      batchRef.current = {};
    }, 0);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [state, batchUpdate] as const;
};

// Optimized search with indexing
export class SearchIndex<T> {
  private index: Map<string, Set<number>> = new Map();
  private items: T[] = [];
  private searchFields: (keyof T)[];

  constructor(items: T[], searchFields: (keyof T)[]) {
    this.items = items;
    this.searchFields = searchFields;
    this.buildIndex();
  }

  private buildIndex(): void {
    this.index.clear();
    
    this.items.forEach((item, index) => {
      this.searchFields.forEach(field => {
        const value = String(item[field]).toLowerCase();
        const words = value.split(/\s+/);
        
        words.forEach(word => {
          if (!this.index.has(word)) {
            this.index.set(word, new Set());
          }
          this.index.get(word)!.add(index);
        });
      });
    });
  }

  search(query: string): T[] {
    if (!query.trim()) return this.items;

    const searchWords = query.toLowerCase().split(/\s+/);
    const resultSets = searchWords.map(word => {
      const matches = new Set<number>();
      
      for (const [indexWord, indices] of this.index.entries()) {
        if (indexWord.includes(word) || word.includes(indexWord)) {
          indices.forEach(index => matches.add(index));
        }
      }
      
      return matches;
    });

    // Intersect all result sets
    const finalIndices = resultSets.reduce((intersection, set) => {
      return new Set([...intersection].filter(index => set.has(index)));
    });

    return Array.from(finalIndices).map(index => this.items[index]);
  }

  updateItems(newItems: T[]): void {
    this.items = newItems;
    this.buildIndex();
  }
}

// Hook for optimized search
export const useOptimizedSearch = <T>(
  items: T[],
  searchFields: (keyof T)[],
  query: string
) => {
  const searchIndex = useMemo(() => new SearchIndex(items, searchFields), [items, searchFields]);
  
  const searchResults = useMemo(() => {
    return searchIndex.search(query);
  }, [searchIndex, query]);

  return searchResults;
}; 