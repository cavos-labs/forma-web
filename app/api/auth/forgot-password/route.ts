import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { validateApiKey, createUnauthorizedResponse } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  // Validate API key
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse();
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Send password reset email using Supabase Auth
    // This will automatically check if the user exists and send the email if they do
    const { data, error } = await supabaseAdmin.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
      }
    );

    console.log("resetError", error);
    error;
    // Always return success for security reasons (don't reveal if email exists)
    return NextResponse.json({
      success: true,
      message:
        "If an account with this email exists, you will receive a password reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    // Still return success for security reasons
    return NextResponse.json({
      success: true,
      message:
        "If an account with this email exists, you will receive a password reset link.",
    });
  }
}
