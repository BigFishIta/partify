import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { tz } = await request.json();
    
    if (!tz || typeof tz !== 'string') {
      return NextResponse.json(
        { error: 'Invalid timezone' },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ success: true });
    
    // Set timezone cookie
    response.cookies.set('tz', tz, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to set timezone' },
      { status: 500 }
    );
  }
}