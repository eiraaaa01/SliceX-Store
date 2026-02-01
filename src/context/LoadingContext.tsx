'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
  withLoading: <T extends (...args: any[]) => Promise<any>>(fn: T) => T;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadingCount, setLoadingCount] = useState(0);

  const showLoading = useCallback(() => {
    setLoadingCount(prev => prev + 1);
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingCount(prev => Math.max(0, prev - 1));
  }, []);
    
  const withLoading = useCallback(<T extends (...args: any[]) => Promise<any>>(fn: T): T => {
    return (async (...args: Parameters<T>) => {
      showLoading();
      try {
        return await fn(...args);
      } finally {
        hideLoading();
      }
    }) as T;
  }, [showLoading, hideLoading]);

  const value = {
    isLoading: loadingCount > 0,
    showLoading,
    hideLoading,
    withLoading
  };

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}
