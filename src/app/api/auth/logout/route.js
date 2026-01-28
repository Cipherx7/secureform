import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '../../../../../lib/auth-constants';

export async function POST() {
    const response = NextResponse.json(
        { message: 'Logged out successfully' },
        { status: 200 }
    );

    // Clear the cx_admin_session cookie
    response.cookies.set({
        name: COOKIE_NAME,
        value: '',
        httpOnly: true,
        expires: new Date(0),
        path: '/',
        sameSite: 'lax',
    });

    return response;
}
