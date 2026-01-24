'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';
import { API_ENDPOINTS } from '@/lib/api-config';

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
            const response = await axios.get(API_ENDPOINTS.STORAGE, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success && response.data.storage) {
                setStorageStats({
                    used: response.data.storage.used,
                    limit: response.data.storage.limit,
                    percentage: parseFloat(response.data.storage.percentage),
                    fileCount: response.data.storage.fileCount
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
