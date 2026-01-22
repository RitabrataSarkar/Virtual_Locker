'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

export interface StorageStats {
    used: number;
    limit: number;
    percentage: number;
    fileCount: number;
}

export function useStorage() {
    const { token, isAuthenticated } = useAuth();
    const [storageStats, setStorageStats] = useState<StorageStats>({
        used: 0,
        limit: 1024 * 1024 * 1024, // 1GB default
        percentage: 0,
        fileCount: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStorageStats = useCallback(async () => {
        if (!token) return;

        try {
            setLoading(true);
            const response = await axios.get('/api/storage', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setStorageStats({
                    used: response.data.used,
                    limit: response.data.limit,
                    percentage: response.data.percentage,
                    fileCount: response.data.fileCount
                });
            }
        } catch (err: any) {
            console.error('Failed to fetch storage stats', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token, isAuthenticated]);

    return {
        storageStats,
        loading,
        error,
        fetchStorageStats
    };
}
