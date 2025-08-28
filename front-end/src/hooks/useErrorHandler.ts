import { useState, useCallback } from 'react';

interface ErrorState {
  message: string;
  type: 'network' | 'api' | 'validation' | 'unknown';
  retryable: boolean;
  retryCount: number;
}

interface AppError {
  message?: string;
  status?: number;
  code?: string;
}

export const useErrorHandler = (maxRetries = 3) => {
  const [error, setError] = useState<ErrorState | null>(null);
  const [retryFunction, setRetryFunction] = useState<(() => Promise<void>) | null>(null);

  const handleError = useCallback((err: AppError | Error, retryFn?: () => Promise<void>) => {
    const errorState: ErrorState = {
      message: err.message || 'An unexpected error occurred',
      type: getErrorType(err),
      retryable: isRetryable(err),
      retryCount: 0
    };

    setError(errorState);
    if (retryFn) {
      setRetryFunction(() => retryFn);
    }
  }, []);

  const retry = useCallback(async () => {
    if (!error || !error.retryable || error.retryCount >= maxRetries || !retryFunction) {
      return;
    }

    try {
      setError(prev => prev ? { ...prev, retryCount: prev.retryCount + 1 } : null);
      await retryFunction();
      clearError();
    } catch (err) {
      handleError(err as AppError);
    }
  }, [error, maxRetries, retryFunction, handleError]);

  const clearError = useCallback(() => {
    setError(null);
    setRetryFunction(null);
  }, []);

  return { error, handleError, retry, clearError };
};

const getErrorType = (err: AppError | Error): ErrorState['type'] => {
  const message = err.message?.toLowerCase() || '';
  
  if (message.includes('fetch') || message.includes('network')) return 'network';
  if (message.includes('graphql') || message.includes('api')) return 'api';
  if (message.includes('validation') || message.includes('invalid')) return 'validation';
  return 'unknown';
};

const isRetryable = (err: AppError | Error): boolean => {
  const message = err.message?.toLowerCase() || '';
  const status = 'status' in err ? err.status?.toString() : '';
  
  const retryableErrors = ['network', 'timeout', '500', '502', '503', '504'];
  
  return retryableErrors.some(type => 
    message.includes(type) || status?.includes(type)
  );
};