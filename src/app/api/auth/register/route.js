import { NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';
import { generateId, isValidEmail, isValidPassword } from '@/lib/utils';
import { ensureTmpDirectory } from '@/lib/vercel-utils';

export async function POST(request) {
  try {
    // Ensure /tmp directory exists in Vercel environment
    if (process.env.VERCEL) {
      ensureTmpDirectory();
    }
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const userId = generateId();
    
    const user = createUser({
      id: userId,
      name,
      email,
      password: hashedPassword
    });

    // Generate token
    const token = generateToken(userId);

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}