import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  // Clear session cookies
  response.cookies.set("wishey_session", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  response.cookies.set("wishey_user_role", "", {
    expires: new Date(0),
    path: "/",
  });

  return response;
}
