import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { validateApiKey, createUnauthorizedResponse } from "@/lib/api-auth";
import { sendMembershipReminderWhatsApp } from "@/lib/whatsapp";

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
    const membershipId = searchParams.get("membershipId"); // Optional membership filter

    if (!gymId) {
      return NextResponse.json(
        { error: "gymId parameter is required" },
        { status: 400 }
      );
    }

    // Build the query for payments with membership and user data
    let query = supabaseAdmin
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
        approved_by,
        rejection_reason,
        notes,
        created_at,
        updated_at,
        memberships!inner (
          id,
          user_id,
          gym_id,
          status,
          start_date,
          end_date,
          monthly_fee,
          users!inner (
            id,
            email,
            first_name,
            last_name,
            phone,
            date_of_birth,
            profile_image_url
          )
        )
      `)
      .eq("memberships.gym_id", gymId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Add status filter if provided
    if (status) {
      query = query.eq("status", status);
    }

    // Add membership filter if provided
    if (membershipId) {
      query = query.eq("membership_id", membershipId);
    }

    const { data: payments, error: paymentsError, count } = await query;

    if (paymentsError) {
      console.error("Payments fetch error:", paymentsError);
      return NextResponse.json(
        { error: "Failed to fetch payments" },
        { status: 500 }
      );
    }

    if (!payments || payments.length === 0) {
      return NextResponse.json({
        success: true,
        payments: [],
        pagination: { limit, offset, total: 0 },
      });
    }

    // Format the response data
    const formattedPayments = payments.map(payment => {
      // Handle memberships relation - it might be an array or object depending on Supabase version
      const membership = Array.isArray(payment.memberships) ? payment.memberships[0] : payment.memberships;
      const user = Array.isArray(membership.users) ? membership.users[0] : membership.users;
      
      return {
        id: payment.id,
        membership_id: payment.membership_id,
        amount: payment.amount,
        payment_method: payment.payment_method,
        sinpe_reference: payment.sinpe_reference,
        sinpe_phone: payment.sinpe_phone,
        payment_proof_url: payment.payment_proof_url,
        status: payment.status,
        payment_date: payment.payment_date,
        approved_date: payment.approved_date,
        approved_by: payment.approved_by,
        rejection_reason: payment.rejection_reason,
        notes: payment.notes,
        created_at: payment.created_at,
        updated_at: payment.updated_at,
        membership: {
          id: membership.id,
          user_id: membership.user_id,
          gym_id: membership.gym_id,
          status: membership.status,
          start_date: membership.start_date,
          end_date: membership.end_date,
          monthly_fee: membership.monthly_fee,
        },
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          date_of_birth: user.date_of_birth,
          profile_image_url: user.profile_image_url,
        }
      };
    });

    return NextResponse.json({
      success: true,
      payments: formattedPayments,
      pagination: {
        limit,
        offset,
        total: count || formattedPayments.length,
      },
    });
  } catch (error) {
    console.error("Payments fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update payment status (approve/reject)
export async function PATCH(request: NextRequest) {
  // Validate API key
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse();
  }

  try {
    const {
      paymentId,
      status,
      rejectionReason,
      notes,
      approvedBy,
    } = await request.json();

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: "Missing required fields: paymentId and status" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be one of: pending, approved, rejected, cancelled" },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      status,
      notes: notes || null,
      updated_at: new Date().toISOString(),
    };

    if (status === 'approved') {
      updateData.approved_date = new Date().toISOString();
      updateData.approved_by = approvedBy || null;
      updateData.rejection_reason = null; // Clear rejection reason if approving
    } else if (status === 'rejected') {
      updateData.rejection_reason = rejectionReason || null;
      updateData.approved_date = null; // Clear approval data if rejecting
      updateData.approved_by = null;
    }

    // Update payment record
    const { data: payment, error: updateError } = await supabaseAdmin
      .from("payments")
      .update(updateData)
      .eq("id", paymentId)
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
        approved_by,
        rejection_reason,
        notes,
        created_at,
        updated_at
      `)
      .single();

    if (updateError) {
      console.error("Payment update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update payment" },
        { status: 500 }
      );
    }

    // If payment is approved, update the membership status to active
    if (status === 'approved') {
      const currentDate = new Date();
      const endDate = new Date(currentDate);
      endDate.setDate(endDate.getDate() + 30); // Add 30 days
      const gracePeriodEnd = new Date(endDate);
      gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 3); // Add 3 grace days

      // Update membership status
      await supabaseAdmin
        .from("memberships")
        .update({
          status: 'active',
          start_date: currentDate.toISOString(),
          end_date: endDate.toISOString(),
          grace_period_end: gracePeriodEnd.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.membership_id);

      // Fetch membership with user and gym data for notifications
      const { data: membershipData, error: membershipError } = await supabaseAdmin
        .from("memberships")
        .select(`
          id,
          user_id,
          gym_id,
          users!inner (
            id,
            email,
            first_name,
            last_name,
            phone
          ),
          gyms!inner (
            id,
            name
          )
        `)
        .eq("id", payment.membership_id)
        .single();

      if (!membershipError && membershipData) {
        const user = membershipData.users;
        const gym = membershipData.gyms;
        
        // Send WhatsApp membership activation notification
        if (user.phone) {
          try {
            await sendMembershipReminderWhatsApp({
              userPhone: user.phone,
              userName: `${user.first_name} ${user.last_name}`,
              gymName: gym.name,
            });
          } catch (whatsappError) {
            console.error("Failed to send WhatsApp notification:", whatsappError);
            // Don't fail the entire request if WhatsApp fails
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        membershipId: payment.membership_id,
        amount: payment.amount,
        paymentMethod: payment.payment_method,
        sinpeReference: payment.sinpe_reference,
        sinpePhone: payment.sinpe_phone,
        paymentProofUrl: payment.payment_proof_url,
        status: payment.status,
        paymentDate: payment.payment_date,
        approvedDate: payment.approved_date,
        approvedBy: payment.approved_by,
        rejectionReason: payment.rejection_reason,
        notes: payment.notes,
        createdAt: payment.created_at,
        updatedAt: payment.updated_at,
      },
      message: `Payment ${status} successfully`
    });

  } catch (error) {
    console.error("Payment update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}