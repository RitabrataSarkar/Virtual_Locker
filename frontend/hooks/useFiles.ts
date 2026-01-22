'use client';

import { useState } from 'react';
import axios from 'axios';
import { FileItem, FilesResponse, UploadFileResponse, CreateFolderRequest } from '@/types/file';
import { useAuth } from './useAuth';

export function useFiles() {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get auth headers
    const getHeaders = () => ({
        Authorization: `Bearer ${token}`,
    });

    // List files and folders
    const listFiles = async (folderId: string | null = null): Promise<{ files: FileItem[]; folders: FileItem[] }> => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (folderId && folderId !== 'root') {
                params.append('folderId', folderId);
            }

            const response = await axios.get<FilesResponse>(`/api/files?${params.toString()}`, {
                headers: getHeaders(),
            });

            return {
                files: response.data.files || [],
                folders: response.data.folders || [],
            };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to load files';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Upload file
    const uploadFile = async (file: File, parentId: string | null = null): Promise<FileItem> => {
        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append('file', file);
            if (parentId && parentId !== 'root') {
                formData.append('parentId', parentId);
            }

            const response = await axios.post<UploadFileResponse>('/api/files', formData, {
                headers: {
                    ...getHeaders(),
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.data.success || !response.data.file) {
                throw new Error(response.data.message || 'Upload failed');
            }

            return response.data.file;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to upload file';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Create folder
    const createFolder = async (name: string, parentId: string | null = null): Promise<FileItem> => {
        try {
            setLoading(true);
            setError(null);

            const data: CreateFolderRequest = {
                name,
                parentId: parentId && parentId !== 'root' ? parentId : null,
            };

            const response = await axios.post('/api/folders', data, {
                headers: getHeaders(),
            });

            if (!response.data.success || !response.data.folder) {
                throw new Error(response.data.message || 'Failed to create folder');
            }

            return response.data.folder;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to create folder';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Delete file or folder
    const deleteFile = async (fileId: string): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            await axios.delete(`/api/files/${fileId}`, {
                headers: getHeaders(),
            });
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to delete';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Rename file or folder
    const renameFile = async (fileId: string, newName: string): Promise<FileItem> => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.patch(
                `/api/files/${fileId}`,
                { name: newName },
                {
                    headers: getHeaders(),
                }
            );

            if (!response.data.success || !response.data.file) {
                throw new Error(response.data.message || 'Failed to rename');
            }

            return response.data.file;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to rename';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Download file
    const downloadFile = async (fileId: string, fileName: string): Promise<void> => {
        try {
            const response = await axios.get(`/api/files/download/${fileId}`, {
                headers: getHeaders(),
                responseType: 'blob',
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            const errorMessage = 'Failed to download file';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    // Move file to different folder
    const moveFile = async (fileId: string, targetFolderId: string | null): Promise<FileItem> => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(
                `/api/files/${fileId}/move`,
                { targetFolderId: targetFolderId || 'root' },
                {
                    headers: getHeaders(),
                }
            );

            if (!response.data.success || !response.data.file) {
                throw new Error(response.data.message || 'Failed to move file');
            }

            return response.data.file;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to move file';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Search files and folders
    const searchFiles = async (query: string): Promise<{ files: FileItem[]; folders: FileItem[]; results: FileItem[] }> => {
        try {
            setLoading(true);
            setError(null);

            if (!query || query.trim().length === 0) {
                return { files: [], folders: [], results: [] };
            }

            const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}`, {
                headers: getHeaders(),
            });

            if (!response.data.success) {
                throw new Error(response.data.message || 'Search failed');
            }

            return {
                files: response.data.files || [],
                folders: response.data.folders || [],
                results: response.data.results || [],
            };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to search';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        listFiles,
        uploadFile,
        createFolder,
        deleteFile,
        renameFile,
        downloadFile,
        moveFile,
        searchFiles,
    };
}
