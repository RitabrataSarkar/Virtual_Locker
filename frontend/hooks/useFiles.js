"use client";

import { useState } from "react";
import axios from "axios";
import { useAuth } from "./useAuth";
import { API_ENDPOINTS } from "@/lib/api-config";

export function useFiles() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get auth headers
  const getHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  // List files and folders
  const listFiles = async (folderId = null) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (folderId && folderId !== "root") {
        params.append("folderId", folderId);
      }

      // 1. Files request
      const filesPromise = axios.get(
        `${API_ENDPOINTS.FILES}?${params.toString()}`,
        {
          headers: getHeaders(),
        },
      );

      // 2. Folders request
      const folderParams = new URLSearchParams();
      if (folderId && folderId !== "root") {
        folderParams.append("parentId", folderId);
      }
      const foldersPromise = axios.get(
        `${API_ENDPOINTS.FOLDERS}?${folderParams.toString()}`,
        {
          headers: getHeaders(),
        },
      );

      const [filesRes, foldersRes] = await Promise.all([
        filesPromise,
        foldersPromise,
      ]);

      const folders = (foldersRes.data.folders || []).map((f) => ({
        ...f,
        isFolder: true,
      }));
      const files = (filesRes.data.files || []).map((f) => ({
        ...f,
        isFolder: false,
      }));

      return {
        files,
        folders,
      };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to load files";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Upload file
  const uploadFile = async (file, parentId = null) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      if (parentId && parentId !== "root") {
        formData.append("folderId", parentId);
      }

      const response = await axios.post(API_ENDPOINTS.FILE_UPLOAD, formData, {
        headers: {
          ...getHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.data.success || !response.data.file) {
        throw new Error(response.data.message || "Upload failed");
      }

      return { ...response.data.file, isFolder: false };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to upload file";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Create folder
  const createFolder = async (name, parentId = null) => {
    try {
      setLoading(true);
      setError(null);

      const data = { name };
      if (parentId && parentId !== "root") {
        data.parentId = parentId;
      }

      const response = await axios.post(API_ENDPOINTS.FOLDERS, data, {
        headers: getHeaders(),
      });

      if (!response.data.success || !response.data.folder) {
        throw new Error(response.data.message || "Failed to create folder");
      }

      return { ...response.data.folder, isFolder: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to create folder";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete file or folder
  const deleteFile = async (id, isFolder = false) => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = isFolder
        ? API_ENDPOINTS.FOLDER_DELETE(id)
        : API_ENDPOINTS.FILE_DELETE(id);

      await axios.delete(endpoint, {
        headers: getHeaders(),
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Rename file or folder
  const renameFile = async (id, newName, isFolder = false) => {
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
        },
      );

      if (
        !response.data.success ||
        (!response.data.file && !response.data.folder)
      ) {
        throw new Error(response.data.message || "Failed to rename");
      }

      const item = isFolder ? response.data.folder : response.data.file;
      return { ...item, isFolder };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to rename";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Download file
  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(API_ENDPOINTS.FILE_DOWNLOAD(fileId), {
        headers: getHeaders(),
        responseType: "blob",
      });

      // Check if the response is actually an error (JSON or HTML) masked as a Blob
      if (response.data.type === "application/json") {
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || "Download failed");
      }
      if (response.data.type === "text/html") {
        throw new Error("File not found on server");
      }

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const errorMessage = err.message || "Failed to download file";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Move file to different folder
  const moveFile = async (id, targetFolderId, isFolder = false) => {
    try {
      setLoading(true);
      setError(null);

      if (isFolder) {
        throw new Error("Moving folders is not yet supported");
      }

      const response = await axios.put(
        API_ENDPOINTS.FILE_MOVE(id),
        { folderId: targetFolderId || "root" },
        {
          headers: getHeaders(),
        },
      );

      if (!response.data.success || !response.data.file) {
        throw new Error(response.data.message || "Failed to move file");
      }

      return { ...response.data.file, isFolder: false };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to move file";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Search files and folders
  const searchFiles = async (query) => {
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
        throw new Error(response.data.message || "Search failed");
      }

      const { files: searchFiles, folders: searchFolders } = response.data
        .results || { files: [], folders: [] };

      const processedFiles = (searchFiles || []).map((f) => ({
        ...f,
        isFolder: false,
      }));
      const processedFolders = (searchFolders || []).map((f) => ({
        ...f,
        isFolder: true,
      }));

      const results = [...processedFolders, ...processedFiles];

      return {
        files: processedFiles,
        folders: processedFolders,
        results,
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to search";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get folder details
  const getFolder = async (folderId) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.FOLDERS}/${folderId}`, {
        headers: getHeaders(),
      });
      return { ...response.data.folder, isFolder: true };
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to get folder details",
      );
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
    getFolder,
  };
}
