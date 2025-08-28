import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Validate API key
function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('X-API-Key');
  const validApiKey = process.env.NEXT_PUBLIC_API_KEY;
  
  if (!apiKey || !validApiKey) {
    return false;
  }
  
  return apiKey === validApiKey;
}

// Create unauthorized response
function createUnauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized', message: 'Invalid or missing API key' },
    { 
      status: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
        'Access-Control-Allow-Credentials': 'false',
      }
    }
  );
}

// Create success response with CORS headers
function createResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { 
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
      'Access-Control-Allow-Credentials': 'false',
    }
  });
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
      'Access-Control-Allow-Credentials': 'false',
    },
  });
}

// GET - Get workouts for a gym in a specific month
export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse();
  }

  const { searchParams } = new URL(request.url);
  const gymId = searchParams.get('gym_id');
  const year = searchParams.get('year');
  const month = searchParams.get('month');

  if (!gymId) {
    return createResponse({ error: 'gym_id is required' }, 400);
  }

  try {
    let query = supabaseAdmin
      .from('daily_workouts')
      .select('*')
      .eq('gym_id', gymId)
      .order('workout_date', { ascending: true });

    // If year and month are provided, filter by that month
    if (year && month) {
      const startDate = `${year}-${month.padStart(2, '0')}-01`;
      const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0];
      query = query.gte('workout_date', startDate).lte('workout_date', endDate);
    }

    const { data: workouts, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return createResponse({ error: 'Database error', details: error.message }, 500);
    }

    return createResponse({ workouts: workouts || [] });
  } catch (error) {
    console.error('Server error:', error);
    return createResponse({ error: 'Internal server error' }, 500);
  }
}

// POST - Create or update a workout for a specific date
export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse();
  }

  try {
    const body = await request.json();
    const { gym_id, workout_date, workout_text } = body;

    if (!gym_id || !workout_date || workout_text === undefined) {
      return createResponse({ 
        error: 'Missing required fields',
        required: ['gym_id', 'workout_date', 'workout_text']
      }, 400);
    }

    // Use upsert to create or update
    const { data, error } = await supabaseAdmin
      .from('daily_workouts')
      .upsert(
        {
          gym_id,
          workout_date,
          workout_text: workout_text.trim(),
        },
        {
          onConflict: 'gym_id,workout_date',
          ignoreDuplicates: false
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return createResponse({ error: 'Database error', details: error.message }, 500);
    }

    return createResponse({ workout: data }, 201);
  } catch (error) {
    console.error('Server error:', error);
    return createResponse({ error: 'Invalid JSON or server error' }, 400);
  }
}

// PUT - Update an existing workout
export async function PUT(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse();
  }

  try {
    const body = await request.json();
    const { id, workout_text } = body;

    if (!id || workout_text === undefined) {
      return createResponse({ 
        error: 'Missing required fields',
        required: ['id', 'workout_text']
      }, 400);
    }

    const { data, error } = await supabaseAdmin
      .from('daily_workouts')
      .update({ workout_text: workout_text.trim() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return createResponse({ error: 'Database error', details: error.message }, 500);
    }

    if (!data) {
      return createResponse({ error: 'Workout not found' }, 404);
    }

    return createResponse({ workout: data });
  } catch (error) {
    console.error('Server error:', error);
    return createResponse({ error: 'Invalid JSON or server error' }, 400);
  }
}

// DELETE - Delete a workout
export async function DELETE(request: NextRequest) {
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse();
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return createResponse({ error: 'id is required' }, 400);
  }

  try {
    const { error } = await supabaseAdmin
      .from('daily_workouts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return createResponse({ error: 'Database error', details: error.message }, 500);
    }

    return createResponse({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    return createResponse({ error: 'Internal server error' }, 500);
  }
}