const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        parentId: {
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
        color: {
            type: String,
            default: '#3b82f6',
        },
        isStarred: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
FolderSchema.index({ userId: 1, parentId: 1 });

module.exports = mongoose.model('Folder', FolderSchema);
