import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: "Successfully signed up (mock API response)",
      data: body,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Invalid request payload",
    }, { status: 400 });
  }
}
