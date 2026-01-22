import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(request: NextRequest) {
    try {
        const userData = getUserFromRequest(request);

        if (!userData) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized',
                },
                { status: 401 }
            );
        }

        await dbConnect();

        const user = await User.findById(userData.userId).select('-password');

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User not found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error: any) {
        console.error('Get user error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to get user',
                error: error.message,
            },
            { status: 500 }
        );
    }
}
