const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');
const File = require('../models/File');
const { authMiddleware } = require('../middleware/auth');

// @route   GET /api/folders
// @desc    Get all folders for user (optionally filtered by parent)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { parentId } = req.query;

        const query = {
            userId: req.user.userId
        };

        // Filter by parent folder
        if (parentId && parentId !== 'root') {
            query.parentId = parentId;
        } else {
            query.parentId = null;
        }

        const folders = await Folder.find(query).sort({ createdAt: -1 });

        res.json({
            success: true,
            folders
        });
    } catch (error) {
        console.error('Get folders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve folders',
            error: error.message
        });
    }
});

// @route   POST /api/folders
// @desc    Create a new folder
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, parentId, color } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Folder name is required'
            });
        }

        // Check if folder with same name exists in same parent
        const existingFolder = await Folder.findOne({
            userId: req.user.userId,
            parentId: parentId && parentId !== 'root' ? parentId : null,
            name: name
        });

        if (existingFolder) {
            return res.status(400).json({
                success: false,
                message: 'A folder with this name already exists in this location'
            });
        }

        const folder = await Folder.create({
            name,
            parentId: parentId && parentId !== 'root' ? parentId : null,
            userId: req.user.userId,
            color: color || '#3b82f6'
        });

        res.status(201).json({
            success: true,
            message: 'Folder created successfully',
            folder
        });
    } catch (error) {
        console.error('Create folder error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create folder',
            error: error.message
        });
    }
});

// @route   GET /api/folders/:folderId
// @desc    Get folder details
// @access  Private
router.get('/:folderId', authMiddleware, async (req, res) => {
    try {
        const folder = await Folder.findOne({
            _id: req.params.folderId,
            userId: req.user.userId
        });

        if (!folder) {
            return res.status(404).json({
                success: false,
                message: 'Folder not found'
            });
        }

        res.json({
            success: true,
            folder
        });
    } catch (error) {
        console.error('Get folder error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve folder',
            error: error.message
        });
    }
});

// @route   PUT /api/folders/:folderId
// @desc    Update folder (rename or change color)
// @access  Private
router.put('/:folderId', authMiddleware, async (req, res) => {
    try {
        const { name, color } = req.body;

        const folder = await Folder.findOne({
            _id: req.params.folderId,
            userId: req.user.userId
        });

        if (!folder) {
            return res.status(404).json({
                success: false,
                message: 'Folder not found'
            });
        }

        if (name) folder.name = name;
        if (color) folder.color = color;

        await folder.save();

        res.json({
            success: true,
            message: 'Folder updated successfully',
            folder
        });
    } catch (error) {
        console.error('Update folder error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update folder',
            error: error.message
        });
    }
});

// @route   DELETE /api/folders/:folderId
// @desc    Delete a folder and all its contents
// @access  Private
router.delete('/:folderId', authMiddleware, async (req, res) => {
    try {
        const folder = await Folder.findOne({
            _id: req.params.folderId,
            userId: req.user.userId
        });

        if (!folder) {
            return res.status(404).json({
                success: false,
                message: 'Folder not found'
            });
        }

        // Recursively delete all files and subfolders
        await deleteFolderRecursively(req.params.folderId, req.user.userId);

        res.json({
            success: true,
            message: 'Folder deleted successfully'
        });
    } catch (error) {
        console.error('Delete folder error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete folder',
            error: error.message
        });
    }
});

// Helper function to recursively delete folders
async function deleteFolderRecursively(folderId, userId) {
    // Delete all files in this folder
    await File.updateMany(
        { folderId: folderId, userId: userId },
        { isDeleted: true, deletedAt: new Date() }
    );

    // Find all subfolders
    const subfolders = await Folder.find({ parentId: folderId, userId: userId });

    // Recursively delete subfolders
    for (const subfolder of subfolders) {
        await deleteFolderRecursively(subfolder._id, userId);
    }

    // Delete the folder itself
    await Folder.deleteOne({ _id: folderId, userId: userId });
}

// @route   PUT /api/folders/:folderId/star
// @desc    Toggle star status of a folder
// @access  Private
router.put('/:folderId/star', authMiddleware, async (req, res) => {
    try {
        const folder = await Folder.findOne({
            _id: req.params.folderId,
            userId: req.user.userId
        });

        if (!folder) {
            return res.status(404).json({
                success: false,
                message: 'Folder not found'
            });
        }

        folder.isStarred = !folder.isStarred;
        await folder.save();

        res.json({
            success: true,
            message: folder.isStarred ? 'Folder starred' : 'Folder unstarred',
            folder
        });
    } catch (error) {
        console.error('Star folder error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update folder',
            error: error.message
        });
    }
});

module.exports = router;
