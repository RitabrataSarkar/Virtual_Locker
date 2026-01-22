// Test MongoDB Connection
// Run this by opening: http://localhost:3000/api/test-db

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET() {
    try {
        await dbConnect();

        return NextResponse.json({
            success: true,
            message: '✅ Database connected successfully!',
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Database connection error:', error);
        return NextResponse.json({
            success: false,
            message: '❌ Database connection failed',
            error: error.message
        }, { status: 500 });
    }
}
