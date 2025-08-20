import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateApiKey, createUnauthorizedResponse } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  // Validate API key
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse();
  }

  try {
    const cookieStore = await cookies();

    // Clear the session cookie
    cookieStore.delete("session");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
