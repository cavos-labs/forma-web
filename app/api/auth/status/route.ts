import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const authUser = await getAuthUser(request);
    
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get gym information for the authenticated user
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('gym_administrators')
      .select(`
        gym_id,
        role,
        is_active,
        gyms (
          id,
          name,
          is_active
        )
      `)
      .eq('user_id', authUser.id)
      .eq('is_active', true)
      .single();

    if (adminError || !adminData) {
      return NextResponse.json(
        { success: false, error: 'No gym found for user' },
        { status: 404 }
      );
    }

    const gym = {
      id: adminData.gyms.id,
      name: adminData.gyms.name,
      is_active: adminData.gyms.is_active,
      role: adminData.role
    };

    return NextResponse.json({
      success: true,
      user: {
        id: authUser.id,
        email: authUser.email,
        metadata: authUser.user_metadata
      },
      gym
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}