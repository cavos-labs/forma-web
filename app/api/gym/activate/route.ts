import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { gymId } = await request.json();
    
    // Verify API key
    const apiKey = request.headers.get('x-api-key');
    const expectedApiKey = process.env.API_KEY || 'pQ7xLm9Yt3ZaVr4Jf8HwC2sN6eDqRb1K';
    
    if (apiKey !== expectedApiKey) {
      return NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 401 }
      );
    }

    if (!gymId) {
      return NextResponse.json(
        { success: false, error: 'Gym ID is required' },
        { status: 400 }
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
        { status: 500 }
      );
    }

    console.log('✅ Gym activated:', updateData);

    return NextResponse.json({
      success: true,
      message: 'Gym activated successfully',
      gym: updateData[0]
    });

  } catch (error) {
    console.error('💥 Error in gym activation:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}