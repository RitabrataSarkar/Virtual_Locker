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
import { Input } from '@/components/ui/input';
import { Loader2, FolderPlus } from 'lucide-react';

interface CreateFolderDialogProps {
    open: boolean;
    onClose: () => void;
    onCreate: (name: string) => Promise<void>;
}

export function CreateFolderDialog({ open, onClose, onCreate }: CreateFolderDialogProps) {
    const [folderName, setFolderName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!folderName.trim()) return;

        setLoading(true);
        try {
            await onCreate(folderName);
            setFolderName('');
            onClose();
        } catch (error) {
            // Error handled by parent
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFolderName('');
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mb-2">
                        <FolderPlus className="w-6 h-6 text-white" />
                    </div>
                    <DialogTitle className="text-center">Create New Folder</DialogTitle>
                    <DialogDescription className="text-center">
                        Enter a name for your new folder
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <Input
                        placeholder="Folder name"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                        disabled={loading}
                        autoFocus
                        className="h-11"
                    />
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreate}
                        disabled={!folderName.trim() || loading}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Folder'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
