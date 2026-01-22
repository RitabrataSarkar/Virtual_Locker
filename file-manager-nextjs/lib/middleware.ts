import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from './auth';

export interface AuthenticatedRequest extends NextRequest {
    user?: {
        userId: string;
        username: string;
        email: string;
    };
}

/**
 * Middleware to verify authentication for API routes
 */
export async function withAuth(
    request: NextRequest,
    handler: (request: AuthenticatedRequest, user: NonNullable<AuthenticatedRequest['user']>) => Promise<NextResponse>
): Promise<NextResponse> {
    const user = getUserFromRequest(request);

    if (!user) {
        return NextResponse.json(
            {
                success: false,
                message: 'Unauthorized - Please login first',
            },
            { status: 401 }
        );
    }

    // Attach user to request
    (request as AuthenticatedRequest).user = user;

    return handler(request as AuthenticatedRequest, user);
}
