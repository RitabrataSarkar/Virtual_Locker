'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Edit } from 'lucide-react';
import { FileItem } from '@/types/file';

interface RenameDialogProps {
    open: boolean;
    file: FileItem | null;
    onClose: () => void;
    onRename: (fileId: string, newName: string) => Promise<void>;
}

export function RenameDialog({ open, file, onClose, onRename }: RenameDialogProps) {
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRename = async () => {
        if (!file || !newName.trim()) return;

        setLoading(true);
        try {
            await onRename(file._id, newName);
            setNewName('');
            onClose();
        } catch (error) {
            // Error handled by parent
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setNewName('');
        onClose();
    };

    // Set initial value when file changes
    React.useEffect(() => {
        if (file && open) {
            setNewName(file.name);
        }
    }, [file, open]);

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mb-2">
                        <Edit className="w-6 h-6 text-white" />
                    </div>
                    <DialogTitle className="text-center">Rename {file?.isFolder ? 'Folder' : 'File'}</DialogTitle>
                    <DialogDescription className="text-center">
                        Enter a new name for "{file?.isFolder ? file?.name : (file?.extension ? `${file?.name}${file?.extension}` : file?.name)}"
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="New name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                            disabled={loading}
                            autoFocus
                            className="h-11"
                        />
                        {!file?.isFolder && file?.extension && (
                            <p className="text-sm text-muted-foreground">
                                File type: <span className="font-medium">{file.extension}</span> (cannot be changed)
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRename}
                        disabled={!newName.trim() || loading || newName === file?.name}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Renaming...
                            </>
                        ) : (
                            'Rename'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
