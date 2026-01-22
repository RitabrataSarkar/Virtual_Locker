'use client';

import React from 'react';
import { FileItem as FileItemType } from '@/types/file';
import { getFileIcon, formatFileSize, formatDate } from '@/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    FileText,
    Folder,
    MoreVertical,
    Download,
    Trash2,
    Edit,
    FileImage,
    FileCode,
    FileArchive,
    FileSpreadsheet,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileListProps {
    files: FileItemType[];
    folders: FileItemType[];
    onFolderClick: (folderId: string) => void;
    onDownload: (file: FileItemType) => void;
    onDelete: (file: FileItemType) => void;
    onRename: (file: FileItemType) => void;
    onMove?: (fileId: string, targetFolderId: string | null) => void;
}

export function FileList({ files, folders, onFolderClick, onDownload, onDelete, onRename, onMove }: FileListProps) {
    const allItems = [...folders, ...files];
    const [draggedItem, setDraggedItem] = React.useState<FileItemType | null>(null);
    const [dropTarget, setDropTarget] = React.useState<string | null>(null);

    const getIcon = (item: FileItemType) => {
        if (item.isFolder) {
            return <Folder className="w-5 h-5 text-amber-500" />;
        }

        // Handle both new extension field and legacy name-based approach
        const fullName = item.extension ? `${item.name}${item.extension}` : item.name;
        const iconName = getFileIcon(fullName, false);

        switch (iconName) {
            case 'file-image':
                return <FileImage className="w-5 h-5 text-green-500" />;
            case 'file-code':
                return <FileCode className="w-5 h-5 text-blue-500" />;
            case 'file-archive':
                return <FileArchive className="w-5 h-5 text-purple-500" />;
            case 'file-spreadsheet':
                return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
            default:
                return <FileText className="w-5 h-5 text-gray-500" />;
        }
    };

    const getTypeBadge = (item: FileItemType) => {
        if (item.isFolder) {
            return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">Folder</Badge>;
        }

        // Handle both new extension field and legacy name-based extraction
        let ext = '';
        if (item.extension) {
            ext = item.extension.replace('.', '').toUpperCase();
        } else {
            // Fallback for existing files without extension field
            ext = item.name.split('.').pop()?.toUpperCase() || '';
        }
        return <Badge variant="outline" className="font-mono text-xs">{ext}</Badge>;
    };

    // Drag and Drop handlers
    const handleDragStart = (e: React.DragEvent, item: FileItemType) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', item._id); // Store file ID for breadcrumb drops
    };

    const handleDragOver = (e: React.DragEvent, item: FileItemType) => {
        if (!item.isFolder || !draggedItem || draggedItem._id === item._id) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDropTarget(item._id);
    };

    const handleDragLeave = () => {
        setDropTarget(null);
    };

    const handleDrop = (e: React.DragEvent, targetFolder: FileItemType) => {
        e.preventDefault();
        e.stopPropagation();

        if (!draggedItem || !targetFolder.isFolder || draggedItem._id === targetFolder._id) {
            setDraggedItem(null);
            setDropTarget(null);
            return;
        }

        if (onMove) {
            onMove(draggedItem._id, targetFolder._id);
        }

        setDraggedItem(null);
        setDropTarget(null);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDropTarget(null);
    };

    if (allItems.length === 0) {
        return (
            <div className="flex  flex-col items-center justify-center h-96 text-gray-400">
                <Folder className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">No files or folders</p>
                <p className="text-sm">Upload a file or create a folder to get started</p>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="w-[50%] font-semibold">Name</TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold">Size</TableHead>
                        <TableHead className="font-semibold">Modified</TableHead>
                        <TableHead className="w-[80px] font-semibold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allItems.map((item) => (
                        <TableRow
                            key={item._id}
                            draggable={onMove !== undefined}
                            onDragStart={(e) => handleDragStart(e, item)}
                            onDragOver={(e) => handleDragOver(e, item)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, item)}
                            onDragEnd={handleDragEnd}
                            className={cn(
                                'hover:bg-gray-50 transition-colors cursor-pointer',
                                item.isFolder && 'hover:bg-amber-50',
                                draggedItem?._id === item._id && 'opacity-50',
                                dropTarget === item._id && item.isFolder && 'bg-blue-50 border-2 border-blue-400'
                            )}
                            onClick={() => item.isFolder && onFolderClick(item._id)}
                        >
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                    {getIcon(item)}
                                    <span className="truncate max-w-md">
                                        {item.isFolder ? item.name : (item.extension ? `${item.name}${item.extension}` : item.name)}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>{getTypeBadge(item)}</TableCell>
                            <TableCell className="text-gray-600">
                                {item.isFolder ? '-' : formatFileSize(item.size)}
                            </TableCell>
                            <TableCell className="text-gray-600 text-sm">
                                {formatDate(item.updatedAt)}
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem onClick={() => onRename(item)} className="cursor-pointer">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Rename
                                        </DropdownMenuItem>
                                        {!item.isFolder && (
                                            <>
                                                <DropdownMenuItem onClick={() => onDownload(item)} className="cursor-pointer">
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => onDelete(item)}
                                            className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
