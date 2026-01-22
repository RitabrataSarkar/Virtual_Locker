import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import dbConnect from '@/lib/db';
import File from '@/models/File';
import { unlink } from 'fs/promises';
import path from 'path';

interface Params {
    params: Promise<{
        fileId: string;
    }>;
}

// GET /api/files/[fileId] - Get file details
export async function GET(request: NextRequest, context: Params) {
    return withAuth(request, async (req, user) => {
        try {
            await dbConnect();

            const { fileId } = await context.params;

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

            return NextResponse.json({
                success: true,
                file,
            });
        } catch (error: any) {
            console.error('Get file error:', error);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to get file',
                    error: error.message,
                },
                { status: 500 }
            );
        }
    });
}

// PATCH /api/files/[fileId] - Update file (rename)
export async function PATCH(request: NextRequest, context: Params) {
    return withAuth(request, async (req, user) => {
        try {
            await dbConnect();

            const { fileId } = await context.params;
            const body = await request.json();

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

            // Update file name (strip extension if provided)
            if (body.name) {
                // Remove any extension from the new name
                const ext = path.extname(body.name);
                const nameWithoutExt = ext ? path.basename(body.name, ext) : body.name;

                file.name = nameWithoutExt;
                await file.save();
            }

            return NextResponse.json({
                success: true,
                message: 'File updated successfully',
                file,
            });
        } catch (error: any) {
            console.error('Update file error:', error);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to update file',
                    error: error.message,
                },
                { status: 500 }
            );
        }
    });
}

// DELETE /api/files/[fileId] - Delete file
export async function DELETE(request: NextRequest, context: Params) {
    return withAuth(request, async (req, user) => {
        try {
            await dbConnect();

            const { fileId } = await context.params;

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

            // If it's a folder, check if it has children
            if (file.isFolder) {
                const children = await File.countDocuments({
                    parentId: fileId,
                    isDeleted: false,
                });

                if (children > 0) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: 'Cannot delete folder with contents. Please delete all files and subfolders first.',
                        },
                        { status: 400 }
                    );
                }
            }

            // Soft delete
            file.isDeleted = true;
            await file.save();

            // If not a folder, try to delete the physical file
            if (!file.isFolder) {
                try {
                    const filePath = path.join(process.cwd(), 'public', file.storagePath);
                    await unlink(filePath);
                } catch (err) {
                    console.error('Failed to delete physical file:', err);
                    // Continue even if file deletion fails
                }
            }

            return NextResponse.json({
                success: true,
                message: file.isFolder ? 'Folder deleted successfully' : 'File deleted successfully',
            });
        } catch (error: any) {
            console.error('Delete file error:', error);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to delete file',
                    error: error.message,
                },
                { status: 500 }
            );
        }
    });
}
