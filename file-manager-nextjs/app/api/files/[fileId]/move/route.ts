import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import dbConnect from '@/lib/db';
import File from '@/models/File';

interface Params {
    params: Promise<{
        fileId: string;
    }>;
}

// POST /api/files/[fileId]/move - Move file to a different folder
export async function POST(request: NextRequest, context: Params) {
    return withAuth(request, async (req, user) => {
        try {
            await dbConnect();

            const { fileId } = await context.params;
            const body = await request.json();
            const { targetFolderId } = body;

            // Validate target folder
            if (targetFolderId && targetFolderId !== 'root') {
                const targetFolder = await File.findOne({
                    _id: targetFolderId,
                    userId: user.userId,
                    isFolder: true,
                    isDeleted: false,
                });

                if (!targetFolder) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: 'Target folder not found',
                        },
                        { status: 404 }
                    );
                }
            }

            // Find the file to move
            const file = await File.findOne({
                _id: fileId,
                userId: user.userId,
                isDeleted: false,
            });

            if (!file) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'File not found',
                    },
                    { status: 404 }
                );
            }

            // Prevent moving a folder into itself or its descendants
            if (file.isFolder && targetFolderId) {
                if (targetFolderId === fileId) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: 'Cannot move a folder into itself',
                        },
                        { status: 400 }
                    );
                }

                // Check if target is a descendant of the source folder
                let currentFolder = await File.findById(targetFolderId);
                while (currentFolder && currentFolder.parentId) {
                    if (currentFolder.parentId.toString() === fileId) {
                        return NextResponse.json(
                            {
                                success: false,
                                message: 'Cannot move a folder into its own subfolder',
                            },
                            { status: 400 }
                        );
                    }
                    currentFolder = await File.findById(currentFolder.parentId);
                }
            }

            // Update the parent folder
            file.parentId = targetFolderId && targetFolderId !== 'root' ? targetFolderId : null;
            await file.save();

            return NextResponse.json({
                success: true,
                message: 'File moved successfully',
                file,
            });
        } catch (error: any) {
            console.error('Move file error:', error);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to move file',
                    error: error.message,
                },
                { status: 500 }
            );
        }
    });
}
