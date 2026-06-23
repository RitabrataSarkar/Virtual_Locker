/**
 * API Configuration
 * Central configuration for all API calls to the backend
 */

// Type declaration for Next.js environment variables

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://virtuallocker-production.up.railway.app";

export const API_ENDPOINTS = {
  // Auth
  SIGNUP: `${API_URL}/api/auth/signup`,
  LOGIN: `${API_URL}/api/auth/login`,
  AUTH_ME: `${API_URL}/api/auth/me`,

  // Files
  FILES: `${API_URL}/api/files`,
  FILE_UPLOAD: `${API_URL}/api/files/upload`,
  FILE_DETAILS: (fileId) => `${API_URL}/api/files/${fileId}`,
  FILE_DOWNLOAD: (fileId) => `${API_URL}/api/files/download/${fileId}`,
  FILE_DELETE: (fileId) => `${API_URL}/api/files/${fileId}`,
  FILE_RENAME: (fileId) => `${API_URL}/api/files/${fileId}/rename`,
  FILE_MOVE: (fileId) => `${API_URL}/api/files/${fileId}/move`,
  FILE_STAR: (fileId) => `${API_URL}/api/files/${fileId}/star`,

  // Folders
  FOLDERS: `${API_URL}/api/folders`,
  FOLDER_DETAILS: (folderId) => `${API_URL}/api/folders/${folderId}`,
  FOLDER_UPDATE: (folderId) => `${API_URL}/api/folders/${folderId}`,
  FOLDER_DELETE: (folderId) => `${API_URL}/api/folders/${folderId}`,
  FOLDER_STAR: (folderId) => `${API_URL}/api/folders/${folderId}/star`,

  // Storage
  STORAGE: `${API_URL}/api/storage`,

  // Search
  SEARCH: (query) => `${API_URL}/api/search?q=${encodeURIComponent(query)}`,
};

/**
 * Get authorization headers with JWT token
 */
export function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/**
 * Get authorization headers for file uploads (multipart/form-data)
 */
export function getAuthHeadersForUpload() {
  const token = localStorage.getItem("token");
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export default API_URL;
