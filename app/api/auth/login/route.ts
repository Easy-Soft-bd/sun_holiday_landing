import { NextResponse } from 'next/server';
import User, { UserRole } from '@/src/models/User';
import jwt from 'jsonwebtoken';
import { parseJsonBody } from '@/src/lib/api-request';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const { data, error } = await parseJsonBody<LoginBody>(request);

    if (error || !data) {
      return NextResponse.json(
        { message: error ?? 'Invalid request body' },
        { status: 400 }
      );
    }

    const email = String(data.email ?? '').trim();
    const password = String(data.password ?? '');

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find the user with password scope
    const user = await User.scope('withPassword').findOne({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isPasswordValid = user.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if the user has an admin-like role
    const adminRoles = [UserRole.ADMIN, UserRole.MANAGER, UserRole.EDITOR];
    if (!adminRoles.includes(user.role)) {
      return NextResponse.json(
        { message: 'Unauthorized: Insufficient permissions' },
        { status: 403 }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '8h' }
    );

    // Create the response
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

    // Set cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
