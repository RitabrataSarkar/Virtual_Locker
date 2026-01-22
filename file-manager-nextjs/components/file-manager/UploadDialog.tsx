'use client';

import { FileUpload } from './FileUpload';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Upload } from 'lucide-react';

interface UploadDialogProps {
    open: boolean;
    onClose: () => void;
    onUpload: (file: File) => Promise<void>;
}

export function UploadDialog({ open, onClose, onUpload }: UploadDialogProps) {
    const handleUpload = async (file: File) => {
        await onUpload(file);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mb-2">
                        <Upload className="w-6 h-6 text-white" />
                    </div>
                    <DialogTitle className="text-center">Upload File</DialogTitle>
                    <DialogDescription className="text-center">
                        Choose a file to upload to your virtual locker
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <FileUpload onUpload={handleUpload} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
