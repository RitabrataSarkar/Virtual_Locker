const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const File = require('../models/File');
const { authMiddleware } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadsDir = path.join(__dirname, '../../uploads', req.user.userId);
        await fs.ensureDir(uploadsDir);
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);
        const uniqueName = `${nameWithoutExt}-${timestamp}${ext}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800') // 50MB default
    },
    fileFilter: (req, file, cb) => {
        const allowedExtensions = [
            '.jpg', '.jpeg', '.png', '.pdf', '.txt', '.doc', '.docx',
            '.xls', '.xlsx', '.ppt', '.pptx', '.mp4', '.zip',
            '.c', '.cpp', '.h', '.hpp', '.java', '.py',
            '.html', '.css', '.js', '.jsx', '.ts', '.tsx',
            '.json', '.xml', '.sql', '.sh', '.bat', '.gif', '.svg'
        ];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error(`File type "${ext}" is not allowed`));
        }
    }
});

// @route   GET /api/files
// @desc    Get all files for user (optionally filtered by folder)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { folderId } = req.query;

        const query = {
            userId: req.user.userId,
            isDeleted: false
        };

        // Filter by folder
        if (folderId && folderId !== 'root') {
            query.folderId = folderId;
        } else {
            query.folderId = null;
        }

        const files = await File.find(query).sort({ createdAt: -1 });

        res.json({
            success: true,
            files
        });
    } catch (error) {
        console.error('Get files error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve files',
            error: error.message
        });
    }
});

// @route   POST /api/files/upload
// @desc    Upload a new file
// @access  Private
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file provided'
            });
        }

        const { folderId } = req.body;

        // Create file record in database
        const fileDoc = await File.create({
            name: path.basename(req.file.originalname, path.extname(req.file.originalname)),
            originalName: req.file.originalname,
            extension: path.extname(req.file.originalname),
            size: req.file.size,
            mimeType: req.file.mimetype,
            path: `/uploads/${req.user.userId}/${req.file.filename}`,
            url: `/uploads/${req.user.userId}/${req.file.filename}`,
            folderId: folderId && folderId !== 'root' ? folderId : null,
            userId: req.user.userId
        });

        res.status(201).json({
            success: true,
            message: 'File uploaded successfully',
            file: fileDoc
        });
    } catch (error) {
        // Delete uploaded file if database operation fails
        if (req.file) {
            await fs.remove(req.file.path);
        }

        console.error('Upload file error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload file'
        });
    }
});

// @route   GET /api/files/:fileId
// @desc    Get file details
// @access  Private
router.get('/:fileId', authMiddleware, async (req, res) => {
    try {
        const file = await File.findOne({
            _id: req.params.fileId,
            userId: req.user.userId
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        res.json({
            success: true,
            file
        });
    } catch (error) {
        console.error('Get file error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve file',
            error: error.message
        });
    }
});

// @route   GET /api/files/download/:fileId
// @desc    Download a file
// @access  Private
router.get('/download/:fileId', authMiddleware, async (req, res) => {
    try {
        const file = await File.findOne({
            _id: req.params.fileId,
            userId: req.user.userId
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        const filePath = path.join(__dirname, '../..', file.path);

        if (!await fs.pathExists(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found on server'
            });
        }

        res.download(filePath, file.originalName);
    } catch (error) {
        console.error('Download file error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to download file',
            error: error.message
        });
    }
});

// @route   DELETE /api/files/:fileId
// @desc    Delete a file (soft delete)
// @access  Private
router.delete('/:fileId', authMiddleware, async (req, res) => {
    try {
        const file = await File.findOne({
            _id: req.params.fileId,
            userId: req.user.userId
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        // Soft delete
        file.isDeleted = true;
        file.deletedAt = new Date();
        await file.save();

        res.json({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete file',
            error: error.message
        });
    }
});

// @route   PUT /api/files/:fileId/rename
// @desc    Rename a file
// @access  Private
router.put('/:fileId/rename', authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }

        const file = await File.findOne({
            _id: req.params.fileId,
            userId: req.user.userId
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        file.name = name;
        await file.save();

        res.json({
            success: true,
            message: 'File renamed successfully',
            file
        });
    } catch (error) {
        console.error('Rename file error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to rename file',
            error: error.message
        });
    }
});

// @route   PUT /api/files/:fileId/move
// @desc    Move a file to different folder
// @access  Private
router.put('/:fileId/move', authMiddleware, async (req, res) => {
    try {
        const { folderId } = req.body;

        const file = await File.findOne({
            _id: req.params.fileId,
            userId: req.user.userId
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        file.folderId = folderId && folderId !== 'root' ? folderId : null;
        await file.save();

        res.json({
            success: true,
            message: 'File moved successfully',
            file
        });
    } catch (error) {
        console.error('Move file error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to move file',
            error: error.message
        });
    }
});

// @route   PUT /api/files/:fileId/star
// @desc    Toggle star status of a file
// @access  Private
router.put('/:fileId/star', authMiddleware, async (req, res) => {
    try {
        const file = await File.findOne({
            _id: req.params.fileId,
            userId: req.user.userId
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        file.isStarred = !file.isStarred;
        await file.save();

        res.json({
            success: true,
            message: file.isStarred ? 'File starred' : 'File unstarred',
            file
        });
    } catch (error) {
        console.error('Star file error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update file',
            error: error.message
        });
    }
});

module.exports = router;
