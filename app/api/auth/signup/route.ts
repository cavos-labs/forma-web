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
      email,
      password,
      firstName,
      lastName,
      gymName,
      gymAddress,
      gymPhone,
      gymEmail,
      monthlyFee,
      sinpePhone,
    } = await request.json();

    // Validate required fields
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !gymName ||
      !gymAddress ||
      !monthlyFee ||
      !sinpePhone
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create auth user
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
        },
      });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Create gym record
    const { data: gym, error: gymError } = await supabaseAdmin
      .from("gyms")
      .insert({
        name: gymName,
        address: gymAddress,
        phone: gymPhone,
        email: gymEmail,
        monthly_fee: parseFloat(monthlyFee),
        sinpe_phone: sinpePhone,
        is_active: false, // Gym starts inactive until payment
      })
      .select()
      .single();

    if (gymError) {
      // Clean up auth user if gym creation fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      return NextResponse.json(
        { error: "Failed to create gym record" },
        { status: 400 }
      );
    }

    // Create gym administrator record
    const { error: adminError } = await supabaseAdmin
      .from("gym_administrators")
      .insert({
        user_id: authUser.user.id,
        gym_id: gym.id,
        role: "owner",
        is_active: true,
      });

    if (adminError) {
      console.error("Admin creation error:", adminError);
      // Clean up gym and auth user if admin creation fails
      await supabaseAdmin.from("gyms").delete().eq("id", gym.id);
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      return NextResponse.json(
        { error: "Failed to create administrator record" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      userId: authUser.user.id,
      gymId: gym.id,
      message:
        "Registration successful. Please complete payment to activate your gym.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
