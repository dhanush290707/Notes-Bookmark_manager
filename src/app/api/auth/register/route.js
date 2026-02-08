import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
    console.log('Registration API called');

    try {
        console.log('Connecting to database...');
        await dbConnect();
        console.log('Database connected successfully');

        let body;
        try {
            body = await request.json();
            console.log('Request body parsed:', { email: body.email, hasPassword: !!body.password });
        } catch (parseErr) {
            console.error('Body parse error:', parseErr);
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }

        const { name, email, password } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Check if user exists
        console.log('Checking for existing user...');
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            console.log('User already exists');
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Create user
        console.log('Creating new user...');
        const user = await User.create({
            name: name || '',
            email: email.toLowerCase(),
            password
        });
        console.log('User created successfully:', user._id);

        return NextResponse.json(
            {
                message: 'User created successfully',
                user: { id: user._id, email: user.email, name: user.name }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error.message);
        console.error('Error stack:', error.stack);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return NextResponse.json({ error: messages.join(', ') }, { status: 400 });
        }

        if (error.code === 11000) {
            return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
        }

        return NextResponse.json(
            { error: 'Registration failed: ' + error.message },
            { status: 500 }
        );
    }
}
