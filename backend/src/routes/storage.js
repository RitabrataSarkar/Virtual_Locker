const express = require('express');
const router = express.Router();
const File = require('../models/File');
const Folder = require('../models/Folder');
const { authMiddleware } = require('../middleware/auth');

// @route   GET /api/storage
// @desc    Get storage usage statistics
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Get all non-deleted files for user
        const files = await File.find({
            userId: req.user.userId,
            isDeleted: false
        });

        // Calculate total storage used
        const totalUsed = files.reduce((sum, file) => sum + file.size, 0);

        // Storage limit (default 1GB)
        const storageLimit = parseInt(process.env.STORAGE_LIMIT || '1073741824'); // 1GB

        // Group files by type
        const filesByType = {};
        files.forEach(file => {
            const type = file.mimeType.split('/')[0] || 'other';
            if (!filesByType[type]) {
                filesByType[type] = { count: 0, size: 0 };
            }
            filesByType[type].count++;
            filesByType[type].size += file.size;
        });

        res.json({
            success: true,
            storage: {
                used: totalUsed,
                limit: storageLimit,
                percentage: ((totalUsed / storageLimit) * 100).toFixed(2),
                fileCount: files.length,
                filesByType
            }
        });
    } catch (error) {
        console.error('Get storage error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve storage information',
            error: error.message
        });
    }
});

module.exports = router;
