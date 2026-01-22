import mongoose, { Schema, Model } from 'mongoose';

export interface IFile {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    name: string;
    extension: string;
    originalName: string;
    path: string;
    size: number;
    mimeType: string;
    isFolder: boolean;
    parentId: mongoose.Types.ObjectId | null;
    storagePath: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

type FileModel = Model<IFile>;

const FileSchema = new Schema<IFile, FileModel>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'File name is required'],
            trim: true,
        },
        extension: {
            type: String,
            default: '',
            trim: true,
        },
        originalName: {
            type: String,
            required: true,
            trim: true,
        },
        path: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            default: 0,
        },
        mimeType: {
            type: String,
            default: 'application/octet-stream',
        },
        isFolder: {
            type: Boolean,
            default: false,
            index: true,
        },
        parentId: {
            type: Schema.Types.ObjectId,
            ref: 'File',
            default: null,
            index: true,
        },
        storagePath: {
            type: String,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound indexes for better query performance
FileSchema.index({ userId: 1, parentId: 1, isDeleted: 1 });
FileSchema.index({ userId: 1, name: 'text' });

// Prevent duplicate model registration
const File = (mongoose.models.File as FileModel) || mongoose.model<IFile, FileModel>('File', FileSchema);

export default File;
