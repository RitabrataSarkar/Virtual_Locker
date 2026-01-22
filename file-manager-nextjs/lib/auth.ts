import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
    throw new Error('Please define JWT_SECRET in .env.local');
}

export interface TokenPayload {
    userId: string;
    username: string;
    email: string;
}

/**
 * Generate JWT token
 */
export function generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        return null;
    }
}

/**
 * Extract user from request (for API routes)
 */
export function getUserFromRequest(request: NextRequest): TokenPayload | null {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader?.startsWith('Bearer ')) {
            return null;
        }

        const token = authHeader.substring(7);
        return verifyToken(token);
    } catch (error) {
        return null;
    }
}

/**
 * Hash password (for migration from old system if needed)
 */
export async function hashPassword(password: string): Promise<string> {
    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Compare password
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    const bcrypt = await import('bcryptjs');
    return bcrypt.compare(password, hash);
}
