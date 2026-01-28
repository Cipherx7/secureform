import dbConnect from '../../../../lib/mongodb';
import Admin from '../../../../models/Admin';
import { NextResponse } from 'next/server';

export async function GET(request) {
    // Security: Disable in production or require a setup secret
    const setupSecret = process.env.SETUP_SECRET;
    const authHeader = request.headers.get('x-setup-secret');

    if (!setupSecret || setupSecret !== authHeader) {
        return Response.json({ error: 'Setup disabled or unauthorized' }, { status: 403 });
    }

    try {
        await dbConnect();

        const username = 'CyberX_admin';
        const password = 'admin123';
        const email = 'admin@cyberx.com';

        let admin = await Admin.findOne({ email });

        if (admin) {
            admin.username = username;
            admin.password = password; // Trigger pre-save hook
            await admin.save();
            return NextResponse.json({ message: 'Admin password reset successfully to: admin123' });
        } else {
            admin = await Admin.create({
                username,
                email,
                password
            });
            return NextResponse.json({ message: 'Admin created successfully with password: admin123' });
        }
    } catch (error) {
        console.error('Setup Error:', error);
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
