const express = require('express');
const router = express.Router();
const File = require('../models/File');
const Folder = require('../models/Folder');
const { authMiddleware } = require('../middleware/auth');

// @route   GET /api/search
// @desc    Search files and folders
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        // Search files
        const files = await File.find({
            userId: req.user.userId,
            isDeleted: false,
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { originalName: { $regex: q, $options: 'i' } }
            ]
        }).limit(20);

        // Search folders
        const folders = await Folder.find({
            userId: req.user.userId,
            name: { $regex: q, $options: 'i' }
        }).limit(20);

        res.json({
            success: true,
            results: {
                files,
                folders,
                total: files.length + folders.length
            }
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: 'Search failed',
            error: error.message
        });
    }
});

module.exports = router;
