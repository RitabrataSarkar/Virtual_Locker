'use client';

import { useRef, useState } from 'react';
import { Upload, X, File, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatFileSize, isAllowedFileType, getAllowedFileTypesMessage } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface FileUploadProps {
    onUpload: (file: File) => Promise<void>;
    maxSize?: number;
}

export function FileUpload({ onUpload, maxSize = 52428800 }: FileUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        // Validate file type
        const { allowed, extension } = isAllowedFileType(file.name);
        if (!allowed) {
            alert(`File type "${extension}" is not allowed.\n\n${getAllowedFileTypesMessage()}`);
            return;
        }

        // Validate file size
        if (file.size > maxSize) {
            alert(`File size exceeds maximum allowed size of ${formatFileSize(maxSize)}`);
            return;
        }
        setSelectedFile(file);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            await onUpload(selectedFile);
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            // Error handled by parent
        } finally {
            setUploading(false);
        }
    };

    const clearSelection = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                className={cn(
                    'border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer',
                    dragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50',
                    uploading && 'opacity-50 pointer-events-none'
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf,.txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.mp4,.zip,.c,.cpp,.h,.hpp,.java,.py,.html,.css,.js,.jsx,.ts,.tsx,.json,.xml,.sql,.sh,.bat"
                    onChange={handleChange}
                    disabled={uploading}
                />

                <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-blue-600" />
                    </div>

                    <div className="space-y-1">
                        <p className="text-base font-medium text-gray-700">
                            {dragActive ? 'Drop file here' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-sm text-gray-500">Maximum file size: {formatFileSize(maxSize)}</p>
                        <p className="text-xs text-gray-400 text-center">
                            Images, Documents, Office files, Videos, Archives, Code files
                        </p>
                    </div>
                </div>
            </div>

            {/* Selected File */}
            {selectedFile && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                                <File className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{selectedFile.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                            </div>
                        </div>

                        {!uploading && (
                            <Button variant="ghost" size="sm" onClick={clearSelection} className="h-8 w-8 p-0">
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {uploading && (
                        <div className="mt-3 space-y-2">
                            <Progress value={50} className="h-2" />
                            <p className="text-xs text-gray-600 text-center">Uploading...</p>
                        </div>
                    )}

                    {!uploading && (
                        <Button
                            onClick={handleUpload}
                            className="w-full mt-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload File
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
