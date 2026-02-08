import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Bookmark from '@/models/Bookmark';

// Fetch metadata from URL
async function fetchMetadata(url) {
    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NotesBookmarkBot/1.0)' },
            signal: AbortSignal.timeout(5000)
        });
        const html = await response.text();
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
            html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
        return {
            title: titleMatch ? titleMatch[1].trim() : '',
            description: descMatch ? descMatch[1].trim() : ''
        };
    } catch {
        return { title: '', description: '' };
    }
}

// GET all bookmarks for current user
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const tags = searchParams.get('tags');
        const q = searchParams.get('q');
        const favorite = searchParams.get('favorite');

        let query = { userId: session.user.id };

        if (tags) {
            const tagArray = tags.split(',').map(t => t.trim().toLowerCase());
            query.tags = { $all: tagArray };
        }

        if (favorite === 'true') {
            query.favorite = true;
        }

        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { url: { $regex: q, $options: 'i' } }
            ];
        }

        const bookmarks = await Bookmark.find(query).sort({ updatedAt: -1 });
        return NextResponse.json(bookmarks);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST create bookmark for current user
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const body = await request.json();

        if (!body.title || !body.description) {
            const metadata = await fetchMetadata(body.url);
            if (!body.title) body.title = metadata.title || body.url;
            if (!body.description) body.description = metadata.description;
        }

        const bookmark = await Bookmark.create({
            ...body,
            userId: session.user.id
        });
        return NextResponse.json(bookmark, { status: 201 });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return NextResponse.json({ error: messages.join(', ') }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
