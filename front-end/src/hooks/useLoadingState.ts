import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  loadingMessage: string;
  progress?: number;
  step?: string;
}

export const useLoadingState = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    loadingMessage: 'Loading...'
  });

  const setLoading = useCallback((
    isLoading: boolean, 
    message = 'Loading...',
  ) => {
    setLoadingState({ isLoading, loadingMessage: message });
  }, []);



  return { loadingState, setLoading };
};