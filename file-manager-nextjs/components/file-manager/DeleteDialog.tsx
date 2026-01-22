'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';
import { FileItem } from '@/types/file';

interface DeleteDialogProps {
    open: boolean;
    file: FileItem | null;
    onClose: () => void;
    onDelete: (fileId: string) => Promise<void>;
}

export function DeleteDialog({ open, file, onClose, onDelete }: DeleteDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!file) return;

        setLoading(true);
        try {
            await onDelete(file._id);
            onClose();
        } catch (error) {
            // Error handled by parent
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center mb-2">
                        <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <DialogTitle className="text-center">Delete {file?.isFolder ? 'Folder' : 'File'}?</DialogTitle>
                    <DialogDescription className="text-center">
                        Are you sure you want to delete "{file?.name}"? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 sm:gap-0 mt-4">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
