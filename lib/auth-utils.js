import { jwtVerify } from 'jose';
import { JWT_SECRET, COOKIE_NAME } from './auth-constants';

export async function verifyAdmin(request) {
    try {
        const token = request.cookies.get(COOKIE_NAME)?.value ||
            request.headers.get('authorization')?.replace('Bearer ', '');

        if (!token) {
            return false;
        }

        const secret = new TextEncoder().encode(JWT_SECRET);
        await jwtVerify(token, secret);
        return true;
    } catch (error) {
        return false;
    }
}

export function unauthorizedResponse() {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
