import { NextRequest } from 'next/server'
import { supabaseAdmin } from './supabase'

export async function verifySession(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session')?.value

    if (!sessionToken) {
      return null
    }

    // Verify the session token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(sessionToken)

    if (error || !user) {
      return null
    }

    // Get user's gym information
    const { data: gymAdmin, error: gymError } = await supabaseAdmin
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
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (gymError || !gymAdmin) {
      return null
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata,
      },
      gym: {
        id: gymAdmin.gyms[0].id,
        name: gymAdmin.gyms[0].name,
        is_active: gymAdmin.gyms[0].is_active,
        role: gymAdmin.role,
      }
    }
  } catch (error) {
    console.error('Session verification error:', error)
    return null
  }
}

export async function requireAuth(request: NextRequest) {
  const session = await verifySession(request)
  
  if (!session) {
    throw new Error('Authentication required')
  }
  
  return session
}