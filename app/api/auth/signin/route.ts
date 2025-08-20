import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import { validateApiKey, createUnauthorizedResponse } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  // Validate API key
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse();
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Sign in user
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Get user's gym information
    console.log('🔍 Fetching gym data for user:', data.user.id);
    
    // First get gym admin info
    const { data: gymAdmin, error: gymError } = await supabaseAdmin
      .from("gym_administrators")
      .select("gym_id, role, is_active")
      .eq("user_id", data.user.id)
      .eq("is_active", true)
      .single();

    console.log('📊 Gym admin data:', gymAdmin);
    
    if (gymError || !gymAdmin) {
      return NextResponse.json(
        { error: "No gym associated with this account" },
        { status: 403 }
      );
    }

    // Now get gym details
    const { data: gymData, error: gymDataError } = await supabaseAdmin
      .from("gyms")
      .select("id, name, is_active")
      .eq("id", gymAdmin.gym_id)
      .single();

    console.log('🏋️ Gym details:', gymData);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("session", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        metadata: data.user.user_metadata,
      },
      gym: {
        id: gymData?.id,
        name: gymData?.name,
        is_active: gymData?.is_active,
        role: gymAdmin.role,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
