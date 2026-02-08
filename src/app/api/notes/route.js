import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Note from '@/models/Note';

// GET all notes
export async function GET(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const tags = searchParams.get('tags');
        const q = searchParams.get('q');
        const favorite = searchParams.get('favorite');

        let query = {};

        // Filter by tags
        if (tags) {
            const tagArray = tags.split(',').map(t => t.trim().toLowerCase());
            query.tags = { $all: tagArray };
        }

        // Filter by favorite
        if (favorite === 'true') {
            query.favorite = true;
        }

        // Text search
        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { content: { $regex: q, $options: 'i' } }
            ];
        }

        const notes = await Note.find(query).sort({ updatedAt: -1 });
        return NextResponse.json(notes);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST create note
export async function POST(request) {
    try {
        await dbConnect();

        const body = await request.json();
        const note = await Note.create(body);
        return NextResponse.json(note, { status: 201 });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return NextResponse.json({ error: messages.join(', ') }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
