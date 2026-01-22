'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FolderPlus, FilePlus, Upload, Search } from 'lucide-react';

import { formatFileSize } from '@/lib/utils';
import { StorageStats } from '@/hooks/useStorage';

interface SidebarProps {
    onCreateFolder: () => void;
    onUploadFile: () => void;
    storageStats?: StorageStats;
}

export function Sidebar({ onCreateFolder, onUploadFile, storageStats }: SidebarProps) {
    // Default stats if not provided
    const stats = storageStats || { used: 0, limit: 1073741824, percentage: 0 };

    // Determine color based on usage
    const getUsageColor = (percentage: number) => {
        if (percentage >= 90) return 'bg-red-500';
        if (percentage >= 75) return 'bg-amber-500';
        return 'bg-gradient-to-r from-blue-500 to-purple-600';
    };

    return (
        <aside className="w-64 bg-white  border-r border-gray-200 p-4 space-y-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Quick Actions */}
            <div className="space-y-2">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Quick Actions
                </h2>

                <Button
                    onClick={onUploadFile}
                    className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                </Button>

                <Button
                    onClick={onCreateFolder}
                    variant="outline"
                    className="w-full justify-start hover:bg-gray-50 hover:border-gray-300"
                >
                    <FolderPlus className="mr-2 h-4 w-4" />
                    New Folder
                </Button>
            </div>

            {/* Scale removed from search area as search was moved */}

            {/* Storage Info */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Storage
                </h2>
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Used</span>
                        <span className="font-medium">
                            {formatFileSize(stats.used)} / {formatFileSize(stats.limit)}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-2 rounded-full transition-all duration-500 ${getUsageColor(stats.percentage)}`}
                            style={{ width: `${Math.max(2, Math.min(100, stats.percentage))}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 text-right">{stats.percentage.toFixed(1)}% used</p>
                </div>
            </div>
        </aside>
    );
}
