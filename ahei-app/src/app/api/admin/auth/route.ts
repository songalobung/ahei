import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password, email } = await req.json();

    const expectedPassword = process.env.ADMIN_PASSWORD || 'AHEI_SOVEREIGN_ADMIN_2026';

    if (!password || password.trim() !== expectedPassword.trim()) {
      return NextResponse.json(
        { success: false, error: 'Invalid Administrator Security Passkey. Access Denied.' },
        { status: 401 }
      );
    }

    // Generate authenticated admin session token
    const token = `ahei_admin_session_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const namePart = email && email.includes('@') ? email.split('@')[0] : 'Auditor';
    const auditorName = `Auditor ${namePart.charAt(0).toUpperCase() + namePart.slice(1)} · Sovereign Council`;

    return NextResponse.json({
      success: true,
      token,
      auditorName,
      message: 'Sovereign Administrator Authentication Successful.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
