'use client';

import React from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BreadcrumbsProps {
    path: Array<{ id: string; name: string }>;
    onNavigate: (folderId: string) => void;
    onDrop?: (fileId: string, targetFolderId: string | null) => void;
}

export function Breadcrumbs({ path, onNavigate, onDrop }: BreadcrumbsProps) {
    const [dropTarget, setDropTarget] = React.useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent, folderId: string | null) => {
        if (!onDrop) return;
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        setDropTarget(folderId || 'root');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDropTarget(null);
    };

    const handleDrop = (e: React.DragEvent, folderId: string | null) => {
        e.preventDefault();
        e.stopPropagation();

        const fileId = e.dataTransfer.getData('text/plain');

        if (onDrop && fileId) {
            onDrop(fileId, folderId);
        }

        setDropTarget(null);
    };

    return (
        <nav className="flex items-center space-x-1 text-sm">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('root')}
                onDragOver={(e) => handleDragOver(e, null)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, null)}
                className={cn(
                    "h-8 px-2 hover:bg-gray-100 transition-colors",
                    dropTarget === 'root' && "bg-blue-100 border-2 border-blue-400 rounded"
                )}
            >
                <Home className="h-4 w-4 mr-1" />
                Home
            </Button>

            {path.map((item, index) => (
                <div key={item.id} className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onNavigate(item.id)}
                        onDragOver={(e) => handleDragOver(e, item.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, item.id)}
                        className={cn(
                            "h-8 px-2 transition-colors",
                            index === path.length - 1
                                ? 'font-semibold text-gray-900 cursor-default'
                                : 'text-gray-600 hover:bg-gray-100',
                            dropTarget === item.id && index !== path.length - 1 && "bg-blue-100 border-2 border-blue-400 rounded"
                        )}
                        disabled={index === path.length - 1}
                    >
                        {item.name}
                    </Button>
                </div>
            ))}
        </nav>
    );
}
