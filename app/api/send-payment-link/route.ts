import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { validateApiKey, createUnauthorizedResponse } from "@/lib/api-auth";
import { sendPaymentProofEmail } from "@/lib/email";
import { sendMembershipReminderWhatsApp } from "@/lib/whatsapp";
import { validateAndFormatPhone } from "@/lib/phone";

export async function POST(request: NextRequest) {
  // Validate API key
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse();
  }

  try {
    const {
      membershipId,
      sendEmail = false, // Changed from true to false
      sendWhatsApp = true,
      customMessage, // Optional custom message
    } = await request.json();

    // Validate required fields
    if (!membershipId) {
      return NextResponse.json(
        { error: "Missing required field: membershipId" },
        { status: 400 }
      );
    }

    // Get membership details with user and gym information
    const { data: membership, error: membershipError } = await supabaseAdmin
      .from("memberships")
      .select(
        `
        id,
        user_id,
        gym_id,
        status,
        monthly_fee,
        start_date,
        end_date,
        users!inner (
          id,
          email,
          first_name,
          last_name,
          phone
        ),
        gyms!inner (
          id,
          name,
          monthly_fee,
          sinpe_phone
        )
      `
      )
      .eq("id", membershipId)
      .single();

    if (membershipError || !membership) {
      console.error("Membership fetch error:", membershipError);
      return NextResponse.json(
        { error: "Membership not found" },
        { status: 404 }
      );
    }

    // Validate membership status - only send payment links for non-active memberships
    if (membership.status === "active") {
      return NextResponse.json(
        { error: "Cannot send payment link for active membership" },
        { status: 400 }
      );
    }

    // Handle users relation - it might be an array or object depending on Supabase version
    const user = Array.isArray(membership.users)
      ? membership.users[0]
      : membership.users;
    const gym = Array.isArray(membership.gyms)
      ? membership.gyms[0]
      : membership.gyms;

    // Get the latest payment for this membership
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("payments")
      .select("id, amount, status")
      .eq("membership_id", membershipId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (paymentError || !payment) {
      console.error("Payment fetch error:", paymentError);
      return NextResponse.json(
        { error: "No payment record found for this membership" },
        { status: 404 }
      );
    }

    const results: {
      email: { success: boolean; data?: any; error?: any } | null;
      whatsapp: { success: boolean; data?: any; error?: any } | null;
    } = {
      email: null,
      whatsapp: null,
    };

    // Send email if requested
    if (sendEmail && user.email) {
      try {
        console.log("📧 Sending payment link email");
        const emailResult = await sendPaymentProofEmail({
          userEmail: user.email,
          userName: `${user.first_name} ${user.last_name}`,
          gymName: gym.name,
          monthlyFee: membership.monthly_fee,
          membershipId: membership.id,
          paymentId: payment.id,
        });
        results.email = emailResult;
        console.log("📤 Email send result:", emailResult);
      } catch (emailError) {
        console.error("❌ Failed to send email:", emailError);
        results.email = { success: false, error: emailError };
      }
    } else if (sendEmail && !user.email) {
      console.log("❌ No email address available for user");
      results.email = { success: false, error: "No email address available" };
    }

    // Send WhatsApp if requested
    if (sendWhatsApp && user.phone) {
      try {
        // Validate and format phone number
        const phoneValidation = validateAndFormatPhone(user.phone);

        if (phoneValidation.isValid) {
          console.log("📱 Sending payment link WhatsApp");
          const whatsappResult = await sendMembershipReminderWhatsApp({
            userPhone: phoneValidation.formattedPhone!,
            userName: `${user.first_name} ${user.last_name}`,
            gymName: gym.name,
            membershipId: membership.id,
            paymentId: payment.id,
          });
          results.whatsapp = whatsappResult;
          console.log("📤 WhatsApp send result:", whatsappResult);
        } else {
          console.error("❌ Invalid phone number:", phoneValidation.error);
          results.whatsapp = {
            success: false,
            error: `Invalid phone number: ${phoneValidation.error}`,
          };
        }
      } catch (whatsappError) {
        console.error("❌ Failed to send WhatsApp:", whatsappError);
        results.whatsapp = { success: false, error: whatsappError };
      }
    } else if (sendWhatsApp && !user.phone) {
      console.log("❌ No phone number available for user");
      results.whatsapp = { success: false, error: "No phone number available" };
    }

    // Check if at least one method was successful
    const emailSuccess = results.email?.success === true;
    const whatsappSuccess = results.whatsapp?.success === true;
    const anySuccess = emailSuccess || whatsappSuccess;

    return NextResponse.json({
      success: anySuccess,
      message: anySuccess
        ? "Payment link sent successfully"
        : "Failed to send payment link",
      membership: {
        id: membership.id,
        status: membership.status,
        monthlyFee: membership.monthly_fee,
        startDate: membership.start_date,
        endDate: membership.end_date,
      },
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
      },
      gym: {
        id: gym.id,
        name: gym.name,
        sinpePhone: gym.sinpe_phone,
      },
      payment: {
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
      },
      results: {
        email: results.email,
        whatsapp: results.whatsapp,
      },
    });
  } catch (error) {
    console.error("Send payment link error:", error);
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
    const membershipId = searchParams.get("membershipId");

    if (!membershipId) {
      return NextResponse.json(
        { error: "membershipId parameter is required" },
        { status: 400 }
      );
    }

    // Get membership details with user and gym information
    const { data: membership, error: membershipError } = await supabaseAdmin
      .from("memberships")
      .select(
        `
        id,
        user_id,
        gym_id,
        status,
        monthly_fee,
        start_date,
        end_date,
        users!inner (
          id,
          email,
          first_name,
          last_name,
          phone
        ),
        gyms!inner (
          id,
          name,
          monthly_fee,
          sinpe_phone
        )
      `
      )
      .eq("id", membershipId)
      .single();

    if (membershipError || !membership) {
      console.error("Membership fetch error:", membershipError);
      return NextResponse.json(
        { error: "Membership not found" },
        { status: 404 }
      );
    }

    // Handle users relation - it might be an array or object depending on Supabase version
    const user = Array.isArray(membership.users)
      ? membership.users[0]
      : membership.users;
    const gym = Array.isArray(membership.gyms)
      ? membership.gyms[0]
      : membership.gyms;

    // Get the latest payment for this membership
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("payments")
      .select("id, amount, status")
      .eq("membership_id", membershipId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (paymentError || !payment) {
      console.error("Payment fetch error:", paymentError);
      return NextResponse.json(
        { error: "No payment record found for this membership" },
        { status: 404 }
      );
    }

    // Generate the payment upload URL
    const uploadUrl = `https://formacr.com/upload-payment?membershipId=${membershipId}&paymentId=${payment.id}`;

    return NextResponse.json({
      success: true,
      membership: {
        id: membership.id,
        status: membership.status,
        monthlyFee: membership.monthly_fee,
        startDate: membership.start_date,
        endDate: membership.end_date,
      },
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
      },
      gym: {
        id: gym.id,
        name: gym.name,
        sinpePhone: gym.sinpe_phone,
      },
      payment: {
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
      },
      paymentLink: uploadUrl,
    });
  } catch (error) {
    console.error("Get payment link error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
