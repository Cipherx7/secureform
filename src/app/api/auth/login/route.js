import dbConnect from '../../../../../lib/mongodb';
import Admin from '../../../../../models/Admin';
import { SignJWT } from 'jose';
import { JWT_SECRET, COOKIE_NAME } from '../../../../../lib/auth-constants';

export async function POST(request) {
  try {
    await dbConnect();

    const { username, password } = await request.json();

    // Find admin by username
    const admin = await Admin.findOne({ username, isActive: true });

    if (!admin) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({
      adminId: admin._id?.toString() || admin.id?.toString() || username,
      username: admin.username
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    return Response.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id || admin.id,
        username: admin.username,
        email: admin.email
      }
    }, {
      headers: {
        'Set-Cookie': `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax`
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
