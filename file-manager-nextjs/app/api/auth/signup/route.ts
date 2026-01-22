import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const signupSchema = z.object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(6),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validatedData = signupSchema.parse(body);

        // Connect to database
        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ username: validatedData.username }, { email: validatedData.email }],
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        existingUser.username === validatedData.username
                            ? 'Username already exists'
                            : 'Email already registered',
                },
                { status: 400 }
            );
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(validatedData.password, salt);

        // Create new user
        const user = await User.create({
            username: validatedData.username,
            email: validatedData.email,
            password: hashedPassword,
        });

        // Generate token
        const token = generateToken({
            userId: user._id.toString(),
            username: user.username,
            email: user.email,
        });

        // Return success response
        return NextResponse.json(
            {
                success: true,
                message: 'Account created successfully',
                token,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            },
            { status: 201 }
        );
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

        console.error('Signup error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to create account',
                error: error.message,
            },
            { status: 500 }
        );
    }
}
