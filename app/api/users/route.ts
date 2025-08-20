import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { validateApiKey, createUnauthorizedResponse } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  // Validate API key
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse();
  }

  try {
    const {
      uid,
      email,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      profileImageUrl,
    } = await request.json();

    // Validate required fields
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Missing required fields: email, firstName, lastName" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if user already exists
    let existingUserQuery = supabaseAdmin
      .from("users")
      .select("id, email, uid")
      .eq("email", email);

    // Only check UID if it's provided
    if (uid) {
      existingUserQuery = existingUserQuery.or(
        `email.eq.${email},uid.eq.${uid}`
      );
    }

    const { data: existingUser, error: checkError } =
      await existingUserQuery.single();

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        );
      }
      if (uid && existingUser.uid === uid) {
        return NextResponse.json(
          { error: "User with this UID already exists" },
          { status: 409 }
        );
      }
    }

    // Create user record
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .insert({
        uid: uid || null,
        email,
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        date_of_birth: dateOfBirth ? new Date(dateOfBirth) : null,
        profile_image_url: profileImageUrl || null,
      })
      .select()
      .single();

    if (userError) {
      console.error("User creation error:", userError);
      return NextResponse.json(
        { error: "Failed to create user record" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        uid: user.uid,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        dateOfBirth: user.date_of_birth,
        profileImageUrl: user.profile_image_url,
        createdAt: user.created_at,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("User registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Validate API key
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse();
  }

  try {
    const { searchParams } = new URL(request.url);
    const gymId = searchParams.get("gymId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabaseAdmin
      .from("users")
      .select(
        `
        id,
        uid,
        email,
        first_name,
        last_name,
        phone,
        date_of_birth,
        profile_image_url,
        created_at,
        updated_at
      `
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // If gymId is provided, only return users who have memberships in that gym
    if (gymId) {
      // First get the user IDs from memberships
      const { data: membershipUserIds } = await supabaseAdmin
        .from("memberships")
        .select("user_id")
        .eq("gym_id", gymId);

      if (membershipUserIds && membershipUserIds.length > 0) {
        const userIds = membershipUserIds.map((m) => m.user_id);
        query = supabaseAdmin
          .from("users")
          .select(
            `
            id,
            uid,
            email,
            first_name,
            last_name,
            phone,
            date_of_birth,
            profile_image_url,
            created_at,
            updated_at
          `
          )
          .in("id", userIds)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);
      } else {
        // No memberships found for this gym, return empty result
        return NextResponse.json({
          success: true,
          users: [],
          pagination: { limit, offset, total: 0 },
        });
      }
    }

    const { data: users, error, count } = await query;

    if (error) {
      console.error("Users fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      users: users.map((user) => ({
        id: user.id,
        uid: user.uid,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        dateOfBirth: user.date_of_birth,
        profileImageUrl: user.profile_image_url,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      })),
      pagination: {
        limit,
        offset,
        total: count || users.length,
      },
    });
  } catch (error) {
    console.error("Users fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
