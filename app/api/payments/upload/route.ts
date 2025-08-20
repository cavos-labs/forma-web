import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { validateApiKey, createUnauthorizedResponse } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  // Validate API key
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse();
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const membershipId = formData.get('membershipId') as string;
    const sinpeReference = formData.get('sinpeReference') as string;
    const sinpePhone = formData.get('sinpePhone') as string;

    if (!file || !membershipId) {
      return NextResponse.json(
        { error: "Missing required fields: file and membershipId" },
        { status: 400 }
      );
    }

    // Validate file type (only images)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only image files are allowed (JPEG, PNG, WebP)" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Verify membership exists and get details
    const { data: membership, error: membershipError } = await supabaseAdmin
      .from("memberships")
      .select(`
        id,
        monthly_fee,
        user_id,
        gym_id,
        users!inner (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .eq("id", membershipId)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json({ error: "Invalid membership ID" }, { status: 400 });
    }

    // Convert file to buffer for upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `payment-proof-${membershipId}-${timestamp}.${fileExtension}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('payment-proofs')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    // If bucket doesn't exist, create it and try again
    if (uploadError && uploadError.message?.includes('Bucket not found')) {
      console.log('Creating payment-proofs bucket...');
      const { error: bucketError } = await supabaseAdmin.storage
        .createBucket('payment-proofs', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
          fileSizeLimit: 5242880, // 5MB
        });

      if (bucketError) {
        console.error("Bucket creation error:", bucketError);
        return NextResponse.json(
          { error: "Failed to create storage bucket" },
          { status: 500 }
        );
      }

      // Retry upload
      const { data: retryUploadData, error: retryUploadError } = await supabaseAdmin.storage
        .from('payment-proofs')
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (retryUploadError) {
        console.error("Retry file upload error:", retryUploadError);
        return NextResponse.json(
          { error: "Failed to upload payment proof after bucket creation" },
          { status: 500 }
        );
      }
    } else if (uploadError) {
      console.error("File upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload payment proof" },
        { status: 500 }
      );
    }

    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('payment-proofs')
      .getPublicUrl(fileName);

    // Create payment record
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("payments")
      .insert({
        membership_id: membershipId,
        amount: membership.monthly_fee,
        payment_method: 'sinpe',
        sinpe_reference: sinpeReference || null,
        sinpe_phone: sinpePhone || null,
        payment_proof_url: publicUrl,
        status: 'pending',
      })
      .select()
      .single();

    if (paymentError) {
      console.error("Payment creation error:", paymentError);
      // Clean up uploaded file if payment creation fails
      await supabaseAdmin.storage
        .from('payment-proofs')
        .remove([fileName]);
      
      return NextResponse.json(
        { error: "Failed to create payment record" },
        { status: 500 }
      );
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
      },
      message: "Payment proof uploaded successfully. Awaiting approval."
    });

  } catch (error) {
    console.error("Payment proof upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}