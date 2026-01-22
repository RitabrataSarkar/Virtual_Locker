export interface FileItem {
    _id: string;
    userId: string;
    name: string;
    extension?: string;
    originalName: string;
    path: string;
    size: number;
    mimeType: string;
    isFolder: boolean;
    parentId: string | null;
    storagePath: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateFileRequest {
    name: string;
    parentId?: string | null;
}

export interface CreateFolderRequest {
    name: string;
    parentId?: string | null;
}

export interface UpdateFileRequest {
    name?: string;
}

export interface UploadFileResponse {
    success: boolean;
    message: string;
    file?: FileItem;
}

export interface FilesResponse {
    success: boolean;
    files: FileItem[];
    folders: FileItem[];
}

export interface FileResponse {
    success: boolean;
    file?: FileItem;
    message?: string;
}
