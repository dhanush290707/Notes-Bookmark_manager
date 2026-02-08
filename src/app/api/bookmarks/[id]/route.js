import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Bookmark from '@/models/Bookmark';

// GET single bookmark (only if owned by user)
export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const bookmark = await Bookmark.findOne({ _id: params.id, userId: session.user.id });
        if (!bookmark) {
            return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 });
        }
        return NextResponse.json(bookmark);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT update bookmark (only if owned by user)
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const body = await request.json();
        const bookmark = await Bookmark.findOneAndUpdate(
            { _id: params.id, userId: session.user.id },
            body,
            { new: true, runValidators: true }
        );

        if (!bookmark) {
            return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 });
        }
        return NextResponse.json(bookmark);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return NextResponse.json({ error: messages.join(', ') }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE bookmark (only if owned by user)
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const bookmark = await Bookmark.findOneAndDelete({ _id: params.id, userId: session.user.id });
        if (!bookmark) {
            return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Bookmark deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
