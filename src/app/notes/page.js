'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';
import NoteCard from '@/components/NoteCard';
import DeleteConfirm from '@/components/DeleteConfirm';
import { notesApi } from '@/lib/api';
import { Plus, FileText, Loader2, AlertCircle } from 'lucide-react';

export default function NotesPage() {
    const router = useRouter();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, note: null });

    // Fetch notes
    const fetchNotes = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = {};
            if (searchQuery) params.q = searchQuery;
            if (selectedTags.length > 0) params.tags = selectedTags.join(',');

            const response = await notesApi.getAll(params);
            setNotes(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch notes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [searchQuery, selectedTags]);

    // Get all unique tags from notes
    const allTags = useMemo(() => {
        const tags = new Set();
        notes.forEach(note => {
            note.tags?.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    }, [notes]);

    // Handle tag toggle
    const handleTagToggle = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    // Navigate to editor for new note
    const handleNewNote = () => {
        router.push('/notes/editor');
    };

    // Navigate to editor for editing
    const handleEdit = (note) => {
        router.push(`/notes/editor?id=${note._id}`);
    };

    // Handle delete
    const handleDelete = async () => {
        try {
            await notesApi.delete(deleteConfirm.note._id);
            setDeleteConfirm({ isOpen: false, note: null });
            fetchNotes();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to delete note');
        }
    };

    // Handle favorite toggle
    const handleToggleFavorite = async (note) => {
        try {
            await notesApi.update(note._id, { favorite: !note.favorite });
            fetchNotes();
        } catch (err) {
            console.error('Failed to update favorite status');
        }
    };

    return (
        <>
            <Header />
            <main className="min-h-screen py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-dark-100 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 border border-primary-500/30 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-primary-400" />
                                </div>
                                Notes
                            </h1>
                            <p className="text-dark-400 mt-1">
                                {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                            </p>
                        </div>
                        <button
                            onClick={handleNewNote}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            New Note
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className="space-y-4 mb-8">
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Search notes..."
                        />
                        <TagFilter
                            tags={allTags}
                            selectedTags={selectedTags}
                            onToggle={handleTagToggle}
                            onClear={() => setSelectedTags([])}
                        />
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
                            <p className="text-dark-300 mb-2">Failed to load notes</p>
                            <p className="text-dark-500 text-sm mb-4">{error}</p>
                            <button onClick={fetchNotes} className="btn-secondary">
                                Try Again
                            </button>
                        </div>
                    ) : notes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 rounded-2xl bg-dark-800/50 border border-dark-700 flex items-center justify-center mb-6">
                                <FileText className="h-10 w-10 text-dark-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-dark-300 mb-2">
                                {searchQuery || selectedTags.length > 0 ? 'No notes found' : 'No notes yet'}
                            </h3>
                            <p className="text-dark-500 mb-6 max-w-md">
                                {searchQuery || selectedTags.length > 0
                                    ? 'Try adjusting your search or filters'
                                    : 'Create your first note to get started organizing your thoughts'}
                            </p>
                            {!searchQuery && selectedTags.length === 0 && (
                                <button
                                    onClick={handleNewNote}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Create Note
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {notes.map((note) => (
                                <NoteCard
                                    key={note._id}
                                    note={note}
                                    onEdit={handleEdit}
                                    onDelete={(note) => setDeleteConfirm({ isOpen: true, note })}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Delete Confirmation */}
            <DeleteConfirm
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, note: null })}
                onConfirm={handleDelete}
                itemType="Note"
                title={deleteConfirm.note?.title}
            />
        </>
    );
}
