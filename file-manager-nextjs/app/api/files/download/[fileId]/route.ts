import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import dbConnect from '@/lib/db';
import File from '@/models/File';
import { readFile } from 'fs/promises';
import path from 'path';

interface Params {
    params: Promise<{
        fileId: string;
    }>;
}

// GET /api/files/download/[fileId] - Download file
export async function GET(request: NextRequest, context: Params) {
    return withAuth(request, async (req, user) => {
        try {
            await dbConnect();

            const { fileId } = await context.params;

            const file = await File.findOne({
                _id: fileId,
                userId: user.userId,
                isDeleted: false,
                isFolder: false,
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

            // Read file from disk
            const filePath = path.join(process.cwd(), 'public', file.storagePath);
            const fileBuffer = await readFile(filePath);

            // Construct full filename with extension
            const downloadFilename = file.extension
                ? `${file.name}${file.extension}`
                : file.originalName;

            // Return file with appropriate headers
            return new NextResponse(fileBuffer, {
                headers: {
                    'Content-Type': file.mimeType,
                    'Content-Disposition': `attachment; filename="${downloadFilename}"`,
                    'Content-Length': file.size.toString(),
                },
            });
        } catch (error: any) {
            console.error('Download file error:', error);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to download file',
                    error: error.message,
                },
                { status: 500 }
            );
        }
    });
}
