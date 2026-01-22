import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import dbConnect from '@/lib/db';
import File from '@/models/File';

// GET /api/search - Search files and folders
export async function GET(request: NextRequest) {
    return withAuth(request, async (req, user) => {
        try {
            await dbConnect();

            const { searchParams } = new URL(request.url);
            const query = searchParams.get('q');

            if (!query || query.trim().length === 0) {
                return NextResponse.json({
                    success: true,
                    results: [],
                    message: 'No search query provided',
                });
            }

            // Build search query
            const searchQuery = {
                userId: user.userId,
                isDeleted: false,
                $or: [
                    // Search by name (case-insensitive)
                    { name: { $regex: query, $options: 'i' } },
                    // Search by original name
                    { originalName: { $regex: query, $options: 'i' } },
                    // Search by extension (for files)
                    { extension: { $regex: query, $options: 'i' } },
                ],
            };

            // Execute search
            const results = await File.find(searchQuery)
                .sort({ isFolder: -1, name: 1 }) // Folders first, then alphabetical
                .limit(50); // Limit to 50 results for performance

            // Get full path for each result
            const resultsWithPath = await Promise.all(
                results.map(async (file) => {
                    const path = await buildFilePath(file);
                    return {
                        ...file.toObject(),
                        fullPath: path,
                    };
                })
            );

            const folders = resultsWithPath.filter((f) => f.isFolder);
            const files = resultsWithPath.filter((f) => !f.isFolder);

            return NextResponse.json({
                success: true,
                results: resultsWithPath,
                folders,
                files,
                total: resultsWithPath.length,
                query,
            });
        } catch (error: any) {
            console.error('Search error:', error);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to search',
                    error: error.message,
                },
                { status: 500 }
            );
        }
    });
}

// Helper function to build full path for a file
async function buildFilePath(file: any): Promise<string> {
    const pathParts: string[] = [];
    let currentFile = file;

    // Traverse up the parent chain
    while (currentFile) {
        pathParts.unshift(currentFile.name);

        if (currentFile.parentId) {
            currentFile = await File.findById(currentFile.parentId);
        } else {
            break;
        }
    }

    return 'Home / ' + pathParts.join(' / ');
}
