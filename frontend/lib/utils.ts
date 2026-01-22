import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format date to readable format
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get file icon based on file type/extension
 */
export function getFileIcon(fileName: string, isFolder: boolean): string {
  if (isFolder) return 'folder';

  const ext = fileName.split('.').pop()?.toLowerCase();

  const iconMap: Record<string, string> = {
    // Images
    jpg: 'file-image',
    jpeg: 'file-image',
    png: 'file-image',
    gif: 'file-image',
    svg: 'file-image',
    webp: 'file-image',
    // Documents
    pdf: 'file-text',
    doc: 'file-text',
    docx: 'file-text',
    txt: 'file-text',
    // Spreadsheets
    xls: 'file-spreadsheet',
    xlsx: 'file-spreadsheet',
    csv: 'file-spreadsheet',
    // Presentations
    ppt: 'file-presentation',
    pptx: 'file-presentation',
    // Archives
    zip: 'file-archive',
    rar: 'file-archive',
    '7z': 'file-archive',
    tar: 'file-archive',
    gz: 'file-archive',
    // Code
    js: 'file-code',
    ts: 'file-code',
    jsx: 'file-code',
    tsx: 'file-code',
    html: 'file-code',
    css: 'file-code',
    py: 'file-code',
    java: 'file-code',
    cpp: 'file-code',
    c: 'file-code',
    // Media
    mp4: 'file-video',
    avi: 'file-video',
    mkv: 'file-video',
    mp3: 'file-audio',
    wav: 'file-audio',
    flac: 'file-audio',
  };

  return iconMap[ext || ''] || 'file';
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Get MIME type from file extension
 */
export function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();

  const mimeTypes: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    webp: 'image/webp',
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
    // Spreadsheets
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    csv: 'text/csv',
    // Media
    mp4: 'video/mp4',
    mp3: 'audio/mpeg',
  };

  return mimeTypes[ext || ''] || 'application/octet-stream';
}

/**
 * Validate file size
 */
export function validateFileSize(size: number, maxSize: number = 52428800): boolean {
  return size <= maxSize;
}

/**
 * Get breadcrumb path from file path
 */
export function getBreadcrumbs(path: string): { name: string; path: string }[] {
  if (!path || path === '/') {
    return [{ name: 'Home', path: '/' }];
  }

  const parts = path.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'Home', path: '/' }];

  let currentPath = '';
  for (const part of parts) {
    currentPath += `/${part}`;
    breadcrumbs.push({ name: part, path: currentPath });
  }

  return breadcrumbs;
}

/**
 * Get display name for file or folder
 */
export function getDisplayName(item: { name: string; extension?: string; isFolder: boolean }): string {
  if (item.isFolder) return item.name;
  return item.extension ? `${item.name}${item.extension}` : item.name;
}

/**
 * Allowed file extensions for upload
 */
export const ALLOWED_FILE_EXTENSIONS = [
  // Images
  '.jpg',
  '.jpeg',
  '.png',

  // Documents
  '.pdf',
  '.txt',
  '.doc',
  '.docx',

  // Spreadsheets
  '.xls',
  '.xlsx',

  // Presentations
  '.ppt',
  '.pptx',

  // Video
  '.mp4',

  // Archives
  '.zip',

  // Programming - C/C++
  '.c',
  '.cpp',
  '.h',
  '.hpp',

  // Programming - Java
  '.java',

  // Programming - Python
  '.py',

  // Programming - Web
  '.html',
  '.css',
  '.js',
  '.jsx',
  '.ts',
  '.tsx',

  // Programming - Other
  '.json',
  '.xml',
  '.sql',
  '.sh',
  '.bat',
];

/**
 * Check if file type is allowed
 */
export function isAllowedFileType(filename: string): { allowed: boolean; extension: string } {
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  const allowed = ALLOWED_FILE_EXTENSIONS.includes(ext);
  return { allowed, extension: ext };
}

/**
 * Get user-friendly message about allowed file types
 */
export function getAllowedFileTypesMessage(): string {
  const types = [
    'Images (JPEG, JPG, PNG)',
    'Documents (PDF, TXT, Word)',
    'Spreadsheets (Excel)',
    'Presentations (PowerPoint)',
    'Videos (MP4)',
    'Archives (ZIP)',
    'Code (C, C++, Java, Python, HTML, CSS, JS, TS, JSON, SQL)',
  ];
  return `Only the following file types are allowed: ${types.join(', ')}`;
}
