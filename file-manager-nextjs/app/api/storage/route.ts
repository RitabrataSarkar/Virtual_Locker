import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import dbConnect from '@/lib/db';
import File from '@/models/File';
import mongoose from 'mongoose';

// GET /api/storage - Get storage usage stats
export async function GET(request: NextRequest) {
    return withAuth(request, async (req, user) => {
        try {
            await dbConnect();

            // Calculate total storage used by aggregating file sizes
            const stats = await File.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(user.userId),
                        isDeleted: false,
                        isFolder: false // Only count files
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalSize: { $sum: '$size' },
                        fileCount: { $sum: 1 }
                    }
                }
            ]);

            const totalUsed = stats.length > 0 ? stats[0].totalSize : 0;
            const fileCount = stats.length > 0 ? stats[0].fileCount : 0;

            // Default limit: 1GB (can be configured via ENV)
            const LIMIT_1GB = 1024 * 1024 * 1024;
            const limit = parseInt(process.env.STORAGE_LIMIT_BYTES || LIMIT_1GB.toString());

            return NextResponse.json({
                success: true,
                used: totalUsed,
                limit: limit,
                percentage: Math.min(100, (totalUsed / limit) * 100),
                fileCount: fileCount
            });

        } catch (error: any) {
            console.error('Storage stats error:', error);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to retrieve storage stats',
                    error: error.message,
                },
                { status: 500 }
            );
        }
    });
}
