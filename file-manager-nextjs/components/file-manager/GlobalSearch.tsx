'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Folder, FileText, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { useFiles } from '@/hooks/useFiles';
import { FileItem } from '@/types/file';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { getFileIcon } from '@/lib/utils';
import {
    FileImage,
    FileCode,
    FileArchive,
    FileSpreadsheet,
} from 'lucide-react';

interface GlobalSearchProps {
    onSearch?: (query: string) => void;
    onFolderSelect?: (folderId: string) => void;
    onFileSelect?: (file: FileItem) => void;
}

export function GlobalSearch({ onSearch, onFolderSelect, onFileSelect }: GlobalSearchProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<{ files: FileItem[]; folders: FileItem[] }>({ files: [], folders: [] });
    const { searchFiles, loading } = useFiles();
    const debouncedQuery = useDebounce(query, 500);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedQuery.trim().length === 0) {
                setResults({ files: [], folders: [] });
                return;
            }

            try {
                const data = await searchFiles(debouncedQuery);
                setResults({ files: data.files, folders: data.folders });
                setIsOpen(true);
            } catch (error) {
                console.error(error);
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setIsOpen(false);
            if (onSearch) onSearch(query);
        }
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setResults({ files: [], folders: [] });
        setIsOpen(false);
        if (onSearch) onSearch('');
    };

    const getIcon = (item: FileItem) => {
        if (item.isFolder) {
            return <Folder className="w-4 h-4 text-amber-500" />;
        }

        const fullName = item.extension ? `${item.name}${item.extension}` : item.name;
        const iconName = getFileIcon(fullName, false);

        switch (iconName) {
            case 'file-image': return <FileImage className="w-4 h-4 text-green-500" />;
            case 'file-code': return <FileCode className="w-4 h-4 text-blue-500" />;
            case 'file-archive': return <FileArchive className="w-4 h-4 text-purple-500" />;
            case 'file-spreadsheet': return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
            default: return <FileText className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-xl">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search files, folders..."
                    className="pl-9 pr-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {isOpen && (query.trim().length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                    <ScrollArea className="max-h-[80vh]">
                        {loading ? (
                            <div className="p-4 flex items-center justify-center text-gray-500">
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Searching...
                            </div>
                        ) : results.folders.length === 0 && results.files.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                No results found for "{query}"
                            </div>
                        ) : (
                            <div className="py-2">
                                {results.folders.length > 0 && (
                                    <div className="mb-2">
                                        <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Folders
                                        </h3>
                                        {results.folders.map((folder) => (
                                            <div
                                                key={folder._id}
                                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors"
                                                onClick={() => {
                                                    if (onFolderSelect) onFolderSelect(folder._id);
                                                    setIsOpen(false);
                                                    setQuery(''); // Optional: clear query on selection
                                                }}
                                            >
                                                <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-medium text-gray-700 truncate">
                                                        {folder.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400 truncate">
                                                        {(folder as any).fullPath || 'Folder'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {results.files.length > 0 && (
                                    <div>
                                        <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Files
                                        </h3>
                                        {results.files.map((file) => (
                                            <div
                                                key={file._id}
                                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors"
                                                onClick={() => {
                                                    if (onFileSelect) onFileSelect(file);
                                                    setIsOpen(false);
                                                }}
                                            >
                                                {getIcon(file)}
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-medium text-gray-700 truncate">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400 truncate">
                                                        {(file as any).fullPath || 'File'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="p-2 border-t border-gray-100 bg-gray-50">
                            <Button
                                variant="ghost"
                                className="w-full text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8"
                                onClick={() => {
                                    if (onSearch) onSearch(query);
                                    setIsOpen(false);
                                }}
                            >
                                View all results for "{query}"
                            </Button>
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    );
}
