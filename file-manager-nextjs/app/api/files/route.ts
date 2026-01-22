import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import dbConnect from '@/lib/db';
import File from '@/models/File';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { z } from 'zod';

// GET /api/files - List files and folders
export async function GET(request: NextRequest) {
    return withAuth(request, async (req, user) => {
        try {
            await dbConnect();

            const { searchParams } = new URL(request.url);
            const folderId = searchParams.get('folderId');
            const search = searchParams.get('search');

            const query: any = {
                userId: user.userId,
                isDeleted: false,
            };

            // If folderId is provided, filter by parent
            if (folderId && folderId !== 'root') {
                query.parentId = folderId;
            } else if (!folderId || folderId === 'root') {
                query.parentId = null;
            }

            // If search query is provided
            if (search) {
                query.$text = { $search: search };
            }

            const files = await File.find(query).sort({ isFolder: -1, name: 1 });

            const folders = files.filter((f) => f.isFolder);
            const regularFiles = files.filter((f) => !f.isFolder);

            return NextResponse.json({
                success: true,
                folders,
                files: regularFiles,
            });
        } catch (error: any) {
            console.error('Get files error:', error);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to retrieve files',
                    error: error.message,
                },
                { status: 500 }
            );
        }
    });
}

// POST /api/files - Upload file
export async function POST(request: NextRequest) {
    return withAuth(request, async (req, user) => {
        try {
            await dbConnect();

            const formData = await request.formData();
            const file = formData.get('file') as File;
            const parentId = formData.get('parentId') as string | null;

            if (!file) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'No file provided',
                    },
                    { status: 400 }
                );
            }

            // Validate file type
            const allowedExtensions = [
                '.jpg', '.jpeg', '.png', '.pdf', '.txt', '.doc', '.docx',
                '.xls', '.xlsx', '.ppt', '.pptx', '.mp4', '.zip',
                '.c', '.cpp', '.h', '.hpp', '.java', '.py',
                '.html', '.css', '.js', '.jsx', '.ts', '.tsx',
                '.json', '.xml', '.sql', '.sh', '.bat'
            ];
            const ext = path.extname(file.name).toLowerCase();
            if (!allowedExtensions.includes(ext)) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `File type "${ext}" is not allowed. Only the following file types are supported: Images, Documents, Spreadsheets, Presentations, Videos, Archives, and Code files (C, C++, Java, Python, HTML, CSS, JS, TS, JSON, SQL).`,
                    },
                    { status: 400 }
                );
            }

            // Validate file size
            const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '52428800');
            if (file.size > maxFileSize) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `File size exceeds maximum allowed size of ${maxFileSize / 1024 / 1024}MB`,
                    },
                    { status: 400 }
                );
            }

            // Create uploads directory if it doesn't exist
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads', user.userId);
            await mkdir(uploadsDir, { recursive: true });

            // Generate unique filename
            const timestamp = Date.now();
            const originalName = file.name;
            const nameWithoutExt = path.basename(originalName, ext);
            const uniqueName = `${nameWithoutExt}-${timestamp}${ext}`;
            const filePath = path.join(uploadsDir, uniqueName);

            // Save file to disk
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            await writeFile(filePath, buffer);

            // Save file metadata to database
            const storagePath = `/uploads/${user.userId}/${uniqueName}`;

            const fileDoc = await File.create({
                userId: user.userId,
                name: nameWithoutExt,
                extension: ext,
                originalName: originalName,
                path: storagePath,
                size: file.size,
                mimeType: file.type || 'application/octet-stream',
                isFolder: false,
                parentId: parentId && parentId !== 'root' ? parentId : null,
                storagePath: storagePath,
            });

            return NextResponse.json({
                success: true,
                message: 'File uploaded successfully',
                file: fileDoc,
            }, { status: 201 });
        } catch (error: any) {
            console.error('Upload file error:', error);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to upload file',
                    error: error.message,
                },
                { status: 500 }
            );
        }
    });
}
