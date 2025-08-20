import { useState, useCallback } from 'react';
import type { ApiError } from '../types/api';

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: ApiError | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
    execute: (...args: any[]) => Promise<T | null>;
    reset: () => void;
}

export function useApi<T>(apiFunction: (...args: any[]) => Promise<{ data: T }>): UseApiReturn<T> {
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const execute = useCallback(async (...args: any[]): Promise<T | null> => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await apiFunction(...args);
            setState({
                data: response.data,
                loading: false,
                error: null,
            });
            return response.data;
        } catch (error) {
            const apiError = error as ApiError;
            setState({
                data: null,
                loading: false,
                error: apiError,
            });
            return null;
        }
    }, [apiFunction]);

    const reset = useCallback(() => {
        setState({
            data: null,
            loading: false,
            error: null,
        });
    }, []);

    return {
        ...state,
        execute,
        reset,
    };
}