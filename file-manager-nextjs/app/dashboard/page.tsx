'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useFiles } from '@/hooks/useFiles';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { FileList } from '@/components/file-manager/FileList';
import { Breadcrumbs } from '@/components/file-manager/Breadcrumbs';
import { CreateFolderDialog } from '@/components/file-manager/CreateFolderDialog';
import { UploadDialog } from '@/components/file-manager/UploadDialog';
import { RenameDialog } from '@/components/file-manager/RenameDialog';
import { DeleteDialog } from '@/components/file-manager/DeleteDialog';
import { FileItem } from '@/types/file';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SortFilterControl, SortOption, SortOrder, FilterOption } from '@/components/file-manager/SortFilterControl';
import { useMemo } from 'react';

import { useStorage } from '@/hooks/useStorage';

export default function DashboardPage() {
    const router = useRouter();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const { storageStats, fetchStorageStats } = useStorage();
    const { listFiles, uploadFile, createFolder, deleteFile, renameFile, downloadFile, moveFile, searchFiles } = useFiles();

    const [files, setFiles] = useState<FileItem[]>([]);
    const [folders, setFolders] = useState<FileItem[]>([]);
    const [currentFolderId, setCurrentFolderId] = useState<string>('root');
    const [breadcrumbPath, setBreadcrumbPath] = useState<Array<{ id: string; name: string }>>([]);
    const [loading, setLoading] = useState(true);

    // Sort and Filter state
    const [sortBy, setSortBy] = useState<SortOption>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [filterType, setFilterType] = useState<FilterOption>('all');

    // Filter and Sort Logic
    const processedData = useMemo(() => {
        let processedFiles = [...files];
        let processedFolders = [...folders];

        // Filtering
        if (filterType !== 'all') {
            const filterMap: Record<string, string[]> = {
                image: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
                document: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'],
                video: ['mp4', 'webm', 'mov', 'avi'],
                audio: ['mp3', 'wav', 'ogg'],
                archive: ['zip', 'rar', '7z', 'tar', 'gz'],
                code: ['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'json', 'py', 'java', 'c', 'cpp'],
            };

            const allowedExts = filterMap[filterType] || [];

            processedFiles = processedFiles.filter(file => {
                const ext = file.extension ? file.extension.replace('.', '').toLowerCase() : '';
                return allowedExts.includes(ext);
            });
            // Folders are usually not filtered by type, or we hide them if filtering active?
            // Let's decide to hide folders if strict file filtering is on, OR show them if they contain matches?
            // Simple approach: Hide folders when filtering by specific file type
            processedFolders = [];
        }

        // Sorting
        const sortFn = (a: FileItem, b: FileItem) => {
            let valA: any = '';
            let valB: any = '';

            switch (sortBy) {
                case 'name':
                    valA = a.name.toLowerCase();
                    valB = b.name.toLowerCase();
                    break;
                case 'size':
                    valA = a.size;
                    valB = b.size;
                    break;
                case 'date':
                    valA = new Date(a.updatedAt).getTime();
                    valB = new Date(b.updatedAt).getTime();
                    break;
            }

            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        };

        processedFiles.sort(sortFn);
        processedFolders.sort(sortFn);

        return { sortedFiles: processedFiles, sortedFolders: processedFolders };
    }, [files, folders, sortBy, sortOrder, filterType]);

    const { sortedFiles, sortedFolders } = processedData;

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<FileItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Dialog states
    const [createFolderOpen, setCreateFolderOpen] = useState(false);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    // Load files
    useEffect(() => {
        if (isAuthenticated) {
            loadFiles();
        }
    }, [currentFolderId, isAuthenticated]);

    const loadFiles = async () => {
        setLoading(true);
        try {
            const data = await listFiles(currentFolderId === 'root' ? null : currentFolderId);
            setFiles(data.files);
            setFolders(data.folders);
        } catch (error: any) {
            toast.error(error.message || 'Failed to load files');
        } finally {
            setLoading(false);
        }
    };

    // Navigate to folder
    const handleFolderClick = (folderId: string) => {
        const folder = folders.find((f) => f._id === folderId);
        if (folder) {
            setCurrentFolderId(folderId);
            setBreadcrumbPath([...breadcrumbPath, { id: folderId, name: folder.name }]);
        }
    };

    // Navigate via breadcrumbs
    const handleBreadcrumbNavigate = (folderId: string) => {
        if (folderId === 'root') {
            setCurrentFolderId('root');
            setBreadcrumbPath([]);
        } else {
            const index = breadcrumbPath.findIndex((item) => item.id === folderId);
            if (index !== -1) {
                setCurrentFolderId(folderId);
                setBreadcrumbPath(breadcrumbPath.slice(0, index + 1));
            }
        }
    };

    // Create folder
    const handleCreateFolder = async (name: string) => {
        try {
            await createFolder(name, currentFolderId === 'root' ? null : currentFolderId);
            toast.success('Folder created successfully');
            loadFiles();
            fetchStorageStats(); // Refresh storage stats
        } catch (error: any) {
            toast.error(error.message || 'Failed to create folder');
            throw error;
        }
    };

    // Upload file
    const handleUploadFile = async (file: File) => {
        try {
            await uploadFile(file, currentFolderId === 'root' ? null : currentFolderId);
            toast.success('File uploaded successfully');
            loadFiles();
            fetchStorageStats(); // Refresh storage stats
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload file');
            throw error;
        }
    };

    // Rename
    const handleRename = async (fileId: string, newName: string) => {
        try {
            await renameFile(fileId, newName);
            toast.success('Renamed successfully');
            loadFiles();
            fetchStorageStats(); // Refresh storage stats
        } catch (error: any) {
            toast.error(error.message || 'Failed to rename');
            throw error;
        }
    };

    // Delete
    const handleDelete = async (fileId: string) => {
        try {
            await deleteFile(fileId);
            toast.success('Deleted successfully');
            loadFiles();
            fetchStorageStats(); // Refresh storage stats
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete');
            throw error;
        }
    };

    // Download
    const handleDownload = async (file: FileItem) => {
        try {
            // Construct full filename with extension
            const fullFilename = file.extension
                ? `${file.name}${file.extension}`
                : file.originalName;

            await downloadFile(file._id, fullFilename);
            toast.success('Download started');
        } catch (error: any) {
            toast.error(error.message || 'Failed to download');
        }
    };

    // Move (Drag and Drop)
    const handleMove = async (fileId: string, targetFolderId: string | null) => {
        try {
            await moveFile(fileId, targetFolderId);
            toast.success('Moved successfully');
            loadFiles();
            fetchStorageStats(); // Refresh storage stats
        } catch (error: any) {
            toast.error(error.message || 'Failed to move');
        }
    };

    // Search
    const handleSearch = async (query: string) => {
        setSearchQuery(query);

        if (!query || query.trim().length === 0) {
            setIsSearching(false);
            setSearchResults([]);
            return;
        }

        try {
            setIsSearching(true);
            const { results } = await searchFiles(query);
            setSearchResults(results);
        } catch (error: any) {
            toast.error(error.message || 'Search failed');
            setSearchResults([]);
        }
    };

    // Show loading while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                onSearch={handleSearch}
                onFolderSelect={(folderId) => {
                    handleFolderClick(folderId);
                    setSearchQuery('');
                    setIsSearching(false);
                    setSearchResults([]);
                }}
                onFileSelect={(file) => {
                    // Logic to highlight or open file details
                    // For now, if it's a file, maybe download or just preview?
                    // Typically 'preview' if we had one.
                    // For now, let's just show a toast or nothing as user might want to locate it.
                    // Ideally, we navigate to its folder and highlight it.
                    if (file.parentId) {
                        handleFolderClick(file.parentId);
                        // We would need a way to 'highlight' the file after navigation.
                        // skipping highlight for now.
                    }
                }}
            />

            <div className="flex">
                <Sidebar
                    onCreateFolder={() => setCreateFolderOpen(true)}
                    onUploadFile={() => setUploadDialogOpen(true)}
                    storageStats={storageStats}
                />

                <main className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Breadcrumbs */}
                        {!isSearching && (
                            <Breadcrumbs
                                path={breadcrumbPath}
                                onNavigate={handleBreadcrumbNavigate}
                                onDrop={handleMove}
                            />
                        )}

                        {/* Search Results Header */}
                        {isSearching && (
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Search Results for "{searchQuery}"
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Found {searchResults.length} {searchResults.length === 1 ? 'item' : 'items'}
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setIsSearching(false);
                                            setSearchResults([]);
                                        }}
                                    >
                                        Clear Search
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Sort and Filter Control */}
                        {!isSearching && (
                            <SortFilterControl
                                currentSort={sortBy}
                                currentOrder={sortOrder}
                                currentFilter={filterType}
                                onSortChange={setSortBy}
                                onOrderChange={setSortOrder}
                                onFilterChange={setFilterType}
                            />
                        )}

                        {/* File List */}
                        {loading ? (
                            <div className="flex items-center justify-center h-96">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            </div>
                        ) : (
                            <FileList
                                files={isSearching ? searchResults.filter(f => !f.isFolder) : sortedFiles}
                                folders={isSearching ? searchResults.filter(f => f.isFolder) : sortedFolders}
                                onFolderClick={handleFolderClick}
                                onDownload={handleDownload}
                                onDelete={(file) => {
                                    setSelectedFile(file);
                                    setDeleteDialogOpen(true);
                                }}
                                onRename={(file) => {
                                    setSelectedFile(file);
                                    setRenameDialogOpen(true);
                                }}
                                onMove={handleMove}
                            />
                        )}
                    </div>
                </main>
            </div>

            {/* Dialogs */}
            <CreateFolderDialog
                open={createFolderOpen}
                onClose={() => setCreateFolderOpen(false)}
                onCreate={handleCreateFolder}
            />

            <UploadDialog
                open={uploadDialogOpen}
                onClose={() => setUploadDialogOpen(false)}
                onUpload={handleUploadFile}
            />

            <RenameDialog
                open={renameDialogOpen}
                file={selectedFile}
                onClose={() => {
                    setRenameDialogOpen(false);
                    setSelectedFile(null);
                }}
                onRename={handleRename}
            />

            <DeleteDialog
                open={deleteDialogOpen}
                file={selectedFile}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setSelectedFile(null);
                }}
                onDelete={handleDelete}
            />
        </div>
    );
}
