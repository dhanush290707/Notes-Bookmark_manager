import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Note from '@/models/Note';

// GET single note
export async function GET(request, { params }) {
    try {
        await dbConnect();

        const note = await Note.findById(params.id);
        if (!note) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }
        return NextResponse.json(note);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT update note
export async function PUT(request, { params }) {
    try {
        await dbConnect();

        const body = await request.json();
        const note = await Note.findByIdAndUpdate(
            params.id,
            body,
            { new: true, runValidators: true }
        );

        if (!note) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }
        return NextResponse.json(note);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return NextResponse.json({ error: messages.join(', ') }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE note
export async function DELETE(request, { params }) {
    try {
        await dbConnect();

        const note = await Note.findByIdAndDelete(params.id);
        if (!note) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Note deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
