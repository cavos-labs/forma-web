import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { validateApiKey, createUnauthorizedResponse } from "@/lib/api-auth";

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
    const status = searchParams.get("status"); // Optional status filter

    if (!gymId) {
      return NextResponse.json(
        { error: "gymId parameter is required" },
        { status: 400 }
      );
    }

    // Build the query for memberships with user data and latest payment
    let query = supabaseAdmin
      .from("memberships")
      .select(`
        id,
        user_id,
        gym_id,
        status,
        start_date,
        end_date,
        grace_period_end,
        monthly_fee,
        created_at,
        updated_at,
        users!inner (
          id,
          email,
          first_name,
          last_name,
          phone,
          date_of_birth,
          profile_image_url,
          created_at
        )
      `)
      .eq("gym_id", gymId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Add status filter if provided
    if (status) {
      query = query.eq("status", status);
    }

    const { data: memberships, error: membershipsError, count } = await query;

    if (membershipsError) {
      console.error("Memberships fetch error:", membershipsError);
      return NextResponse.json(
        { error: "Failed to fetch memberships" },
        { status: 500 }
      );
    }

    if (!memberships || memberships.length === 0) {
      return NextResponse.json({
        success: true,
        memberships: [],
        pagination: { limit, offset, total: 0 },
      });
    }

    // Get the latest payment for each membership
    const membershipIds = memberships.map(m => m.id);
    
    const { data: payments, error: paymentsError } = await supabaseAdmin
      .from("payments")
      .select(`
        id,
        membership_id,
        amount,
        payment_method,
        sinpe_reference,
        sinpe_phone,
        payment_proof_url,
        status,
        payment_date,
        approved_date,
        notes
      `)
      .in("membership_id", membershipIds)
      .order("payment_date", { ascending: false });

    if (paymentsError) {
      console.error("Payments fetch error:", paymentsError);
      // Continue without payments data rather than failing
    }

    // Create a map of latest payments by membership_id
    const latestPaymentsMap = new Map();
    if (payments) {
      payments.forEach(payment => {
        if (!latestPaymentsMap.has(payment.membership_id)) {
          latestPaymentsMap.set(payment.membership_id, payment);
        }
      });
    }

    // Format the response data
    const formattedMemberships = memberships.map(membership => {
      // Handle users relation - it might be an array or object depending on Supabase version
      const user = Array.isArray(membership.users) ? membership.users[0] : membership.users;
      
      return {
        id: membership.id,
        user_id: membership.user_id,
        gym_id: membership.gym_id,
        status: membership.status,
        start_date: membership.start_date,
        end_date: membership.end_date,
        grace_period_end: membership.grace_period_end,
        monthly_fee: membership.monthly_fee,
        created_at: membership.created_at,
        updated_at: membership.updated_at,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          date_of_birth: user.date_of_birth,
          profile_image_url: user.profile_image_url,
          created_at: user.created_at,
        },
        latest_payment: latestPaymentsMap.get(membership.id) || null
      };
    });

    return NextResponse.json({
      success: true,
      memberships: formattedMemberships,
      pagination: {
        limit,
        offset,
        total: count || formattedMemberships.length,
      },
    });
  } catch (error) {
    console.error("Memberships fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}