import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Bookmark from '@/models/Bookmark';

// GET single bookmark
export async function GET(request, { params }) {
    try {
        await dbConnect();

        const bookmark = await Bookmark.findById(params.id);
        if (!bookmark) {
            return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 });
        }
        return NextResponse.json(bookmark);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT update bookmark
export async function PUT(request, { params }) {
    try {
        await dbConnect();

        const body = await request.json();
        const bookmark = await Bookmark.findByIdAndUpdate(
            params.id,
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

// DELETE bookmark
export async function DELETE(request, { params }) {
    try {
        await dbConnect();

        const bookmark = await Bookmark.findByIdAndDelete(params.id);
        if (!bookmark) {
            return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Bookmark deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
