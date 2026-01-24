'use client';

import { useState } from 'react';
import axios from 'axios';
import { FileItem, FilesResponse, UploadFileResponse, CreateFolderRequest } from '@/types/file';
import { useAuth } from './useAuth';
import { API_ENDPOINTS } from '@/lib/api-config';

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

            // 1. Files request
            const filesPromise = axios.get<FilesResponse>(`${API_ENDPOINTS.FILES}?${params.toString()}`, {
                headers: getHeaders(),
            });

            // 2. Folders request
            const folderParams = new URLSearchParams();
            if (folderId && folderId !== 'root') {
                folderParams.append('parentId', folderId);
            }
            const foldersPromise = axios.get<{ success: boolean; folders: FileItem[] }>(`${API_ENDPOINTS.FOLDERS}?${folderParams.toString()}`, {
                headers: getHeaders(),
            });

            const [filesRes, foldersRes] = await Promise.all([filesPromise, foldersPromise]);

            const folders = (foldersRes.data.folders || []).map(f => ({ ...f, isFolder: true }));
            const files = (filesRes.data.files || []).map(f => ({ ...f, isFolder: false }));

            return {
                files,
                folders,
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
                formData.append('folderId', parentId);
            }

            const response = await axios.post<UploadFileResponse>(API_ENDPOINTS.FILE_UPLOAD, formData, {
                headers: {
                    ...getHeaders(),
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.data.success || !response.data.file) {
                throw new Error(response.data.message || 'Upload failed');
            }

            return { ...response.data.file, isFolder: false };
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

            const data: any = { name };
            if (parentId && parentId !== 'root') {
                data.parentId = parentId;
            }

            const response = await axios.post(API_ENDPOINTS.FOLDERS, data, {
                headers: getHeaders(),
            });

            if (!response.data.success || !response.data.folder) {
                throw new Error(response.data.message || 'Failed to create folder');
            }

            return { ...response.data.folder, isFolder: true };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to create folder';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Delete file or folder
    const deleteFile = async (id: string, isFolder: boolean = false): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const endpoint = isFolder
                ? API_ENDPOINTS.FOLDER_DELETE(id)
                : API_ENDPOINTS.FILE_DELETE(id);

            await axios.delete(endpoint, {
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
    const renameFile = async (id: string, newName: string, isFolder: boolean = false): Promise<FileItem> => {
        try {
            setLoading(true);
            setError(null);

            const endpoint = isFolder
                ? API_ENDPOINTS.FOLDER_UPDATE(id)
                : API_ENDPOINTS.FILE_RENAME(id);

            const response = await axios.put(
                endpoint,
                { name: newName },
                {
                    headers: getHeaders(),
                }
            );

            if (!response.data.success || (!response.data.file && !response.data.folder)) {
                throw new Error(response.data.message || 'Failed to rename');
            }

            const item = isFolder ? response.data.folder : response.data.file;
            return { ...item, isFolder };
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
            const response = await axios.get(API_ENDPOINTS.FILE_DOWNLOAD(fileId), {
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
    const moveFile = async (id: string, targetFolderId: string | null, isFolder: boolean = false): Promise<FileItem> => {
        try {
            setLoading(true);
            setError(null);

            if (isFolder) {
                throw new Error("Moving folders is not yet supported");
            }

            const response = await axios.put(
                API_ENDPOINTS.FILE_MOVE(id),
                { folderId: targetFolderId || 'root' },
                {
                    headers: getHeaders(),
                }
            );

            if (!response.data.success || !response.data.file) {
                throw new Error(response.data.message || 'Failed to move file');
            }

            return { ...response.data.file, isFolder: false };
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

            const response = await axios.get(API_ENDPOINTS.SEARCH(query), {
                headers: getHeaders(),
            });

            if (!response.data.success) {
                throw new Error(response.data.message || 'Search failed');
            }

            // Ensure isFolder flag is set correctly on results
            const files = (response.data.files || []).map((f: any) => ({ ...f, isFolder: false }));
            const folders = (response.data.folders || []).map((f: any) => ({ ...f, isFolder: true }));
            const results = (response.data.results || []).map((item: any) => ({
                ...item,
                isFolder: !!item.isFolder
            }));

            return {
                files,
                folders,
                results
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
