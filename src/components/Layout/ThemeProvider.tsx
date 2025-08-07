import { createContext, useContext, useEffect, useState, useMemo, useCallback, memo } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// Memoized theme getter with caching
const getStoredTheme = (() => {
  let cachedTheme: Theme | null = null;
  let cacheTime = 0;
  const CACHE_DURATION = 1 * 60 * 1000; // 1 minute

  return (storageKey: string, defaultTheme: Theme): Theme => {
    const now = Date.now();
    if (cachedTheme && (now - cacheTime) < CACHE_DURATION) {
      return cachedTheme;
    }

    try {
      const stored = localStorage.getItem(storageKey) as Theme;
      cachedTheme = stored || defaultTheme;
      cacheTime = now;
      return cachedTheme;
    } catch (error) {
      console.warn("Error reading theme from localStorage:", error);
      return defaultTheme;
    }
  };
})();

// Memoized theme setter with error handling
const setStoredTheme = (storageKey: string, theme: Theme) => {
  try {
    localStorage.setItem(storageKey, theme);
  } catch (error) {
    console.warn("Error saving theme to localStorage:", error);
  }
};

// Performance monitoring hook
const useThemePerformanceMonitor = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'measure' && entry.name.includes('theme')) {
            console.log(`ThemeProvider ${entry.name}: ${entry.duration}ms`);
          }
        });
      });
      
      observer.observe({ entryTypes: ['measure'] });
      
      return () => observer.disconnect();
    }
  }, []);
};

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
  ...props
}: ThemeProviderProps) {
  // Performance monitoring
  useThemePerformanceMonitor();

  const [theme, setThemeState] = useState<Theme>(() => 
    getStoredTheme(storageKey, defaultTheme)
  );

  // Memoized theme setter
  const setTheme = useCallback((newTheme: Theme) => {
    setStoredTheme(storageKey, newTheme);
    setThemeState(newTheme);
  }, [storageKey]);

  // Memoized theme application
  const applyTheme = useCallback((currentTheme: Theme) => {
    const startTime = performance.now();
    
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (currentTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
    } else {
      root.classList.add(currentTheme);
    }

    // Performance measurement - only log the time, don't use performance.measure
    if (process.env.NODE_ENV === 'development') {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.log(`Theme application took: ${duration.toFixed(2)}ms`);
    }
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Handle system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      applyTheme('system');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  // Memoized context value
  const contextValue = useMemo(() => ({
    theme,
    setTheme,
  }), [theme, setTheme]);

  return (
    <ThemeProviderContext.Provider {...props} value={contextValue}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}

// Memoized theme provider wrapper for better performance
export const MemoizedThemeProvider = memo(ThemeProvider);
MemoizedThemeProvider.displayName = "MemoizedThemeProvider";