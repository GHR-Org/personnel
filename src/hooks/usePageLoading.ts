"use client";

import { useState, useEffect } from "react";

interface UsePageLoadingOptions {
  /**
   * Durée minimale d'affichage du skeleton (en ms)
   * Évite les flashs trop rapides
   */
  minLoadingTime?: number;
  
  /**
   * Durée maximale d'affichage du skeleton (en ms)
   * Timeout de sécurité
   */
  maxLoadingTime?: number;
  
  /**
   * Délai avant de commencer le chargement (en ms)
   * Utile pour simuler des appels API
   */
  delay?: number;
}

interface UsePageLoadingReturn {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
}

/**
 * Hook pour gérer l'état de chargement des pages avec skeleton
 */
export function usePageLoading(options: UsePageLoadingOptions = {}): UsePageLoadingReturn {
  const {
    minLoadingTime = 800,
    maxLoadingTime = 5000,
    delay = 0
  } = options;

  const [isLoading, setIsLoading] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);

  const startLoading = () => {
    setStartTime(Date.now());
    setIsLoading(true);
  };

  const stopLoading = () => {
    if (!startTime) {
      setIsLoading(false);
      return;
    }

    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, minLoadingTime - elapsed);

    if (remainingTime > 0) {
      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    } else {
      setIsLoading(false);
    }
  };

  const setLoading = (loading: boolean) => {
    if (loading) {
      startLoading();
    } else {
      stopLoading();
    }
  };

  // Auto-start loading avec délai optionnel
  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        startLoading();
      }, delay);
      return () => clearTimeout(timer);
    } else {
      startLoading();
    }
  }, [delay]);

  // Timeout de sécurité
  useEffect(() => {
    if (isLoading && startTime) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, maxLoadingTime);
      return () => clearTimeout(timer);
    }
  }, [isLoading, startTime, maxLoadingTime]);

  return {
    isLoading,
    setLoading,
    startLoading,
    stopLoading
  };
}

/**
 * Hook simplifié pour simuler le chargement de données
 */
export function useDataLoading(loadingTime: number = 1500) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, loadingTime);

    return () => clearTimeout(timer);
  }, [loadingTime]);

  return isLoading;
}

/**
 * Hook pour gérer le chargement avec simulation d'appel API
 */
export function useAsyncDataLoading<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await asyncFunction();
        
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { isLoading, data, error };
}
