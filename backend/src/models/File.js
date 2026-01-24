const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        originalName: {
            type: String,
            required: true,
        },
        extension: {
            type: String,
            trim: true,
        },
        size: {
            type: Number,
            required: true,
        },
        mimeType: {
            type: String,
            required: true,
        },
        path: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        folderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Folder',
            default: null,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        isStarred: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
FileSchema.index({ userId: 1, folderId: 1 });
FileSchema.index({ userId: 1, isDeleted: 1 });
FileSchema.index({ userId: 1, isStarred: 1 });

module.exports = mongoose.model('File', FileSchema);
