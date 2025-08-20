import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Handle preflight OPTIONS request
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    },
  });
}

export async function POST(request: NextRequest) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
  };

  try {
    const { gymId } = await request.json();
    
    // Verify API key
    const apiKey = request.headers.get('x-api-key');
    const expectedApiKey = process.env.API_KEY || 'pQ7xLm9Yt3ZaVr4Jf8HwC2sN6eDqRb1K';

    if (apiKey !== expectedApiKey) {
      return NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 401, headers: corsHeaders }
      );
    }

    if (!gymId) {
      return NextResponse.json(
        { success: false, error: 'Gym ID is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log(`🏋️ Activating gym ${gymId}`);

    // Activate the gym
    const { data: updateData, error: updateError } = await supabaseAdmin
      .from('gyms')
      .update({ 
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', gymId)
      .select();

    if (updateError) {
      console.error('❌ Error activating gym:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to activate gym' },
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('✅ Gym activated:', updateData);

    return NextResponse.json({
      success: true,
      message: 'Gym activated successfully',
      gym: updateData[0]
    }, {
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('💥 Error in gym activation:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}