import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import dbConnect from '@/lib/db';
import File from '@/models/File';
import { z } from 'zod';

const createFolderSchema = z.object({
    name: z.string().min(1, 'Folder name is required'),
    parentId: z.string().nullable().optional(),
});

// POST /api/folders - Create new folder
export async function POST(request: NextRequest) {
    return withAuth(request, async (req, user) => {
        try {
            await dbConnect();

            const body = await request.json();
            const validatedData = createFolderSchema.parse(body);

            // Check if folder with same name already exists in the same parent
            const existingFolder = await File.findOne({
                userId: user.userId,
                name: validatedData.name,
                parentId: validatedData.parentId || null,
                isFolder: true,
                isDeleted: false,
            });

            if (existingFolder) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'A folder with this name already exists',
                    },
                    { status: 400 }
                );
            }

            // Create folder
            const folder = await File.create({
                userId: user.userId,
                name: validatedData.name,
                extension: '',
                originalName: validatedData.name,
                path: '/',
                size: 0,
                mimeType: 'folder',
                isFolder: true,
                parentId: validatedData.parentId || null,
                storagePath: '/',
            });

            return NextResponse.json(
                {
                    success: true,
                    message: 'Folder created successfully',
                    folder,
                },
                { status: 201 }
            );
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Validation error',
                        error: error.issues[0].message,
                    },
                    { status: 400 }
                );
            }

            console.error('Create folder error:', error);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to create folder',
                    error: error.message,
                },
                { status: 500 }
            );
        }
    });
}
