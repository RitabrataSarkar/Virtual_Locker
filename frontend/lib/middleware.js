import { NextResponse } from "next/server";
import { getUserFromRequest } from "./auth";

/**
 * Middleware to verify authentication for API routes
 */
export async function withAuth(request, handler) {
  const user = getUserFromRequest(request);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized - Please login first",
      },
      { status: 401 },
    );
  }

  // Attach user to request
  request.user = user;

  return handler(request, user);
}
