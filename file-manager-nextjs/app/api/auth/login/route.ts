import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validatedData = loginSchema.parse(body);

        // Connect to database
        await dbConnect();

        // Find user
        const user = await User.findOne({ username: validatedData.username });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid username or password',
                },
                { status: 401 }
            );
        }

        // Check password
        const isPasswordValid = await user.comparePassword(validatedData.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid username or password',
                },
                { status: 401 }
            );
        }

        // Generate token
        const token = generateToken({
            userId: user._id.toString(),
            username: user.username,
            email: user.email,
        });

        // Return success response
        return NextResponse.json({
            success: true,
            message: `Welcome back, ${user.username}!`,
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Validation error',
                    error: error.errors[0].message,
                },
                { status: 400 }
            );
        }

        console.error('Login error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Login failed',
                error: error.message,
            },
            { status: 500 }
        );
    }
}
