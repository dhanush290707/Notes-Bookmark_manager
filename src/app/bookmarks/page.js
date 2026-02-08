'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';
import BookmarkCard from '@/components/BookmarkCard';
import BookmarkForm from '@/components/BookmarkForm';
import DeleteConfirm from '@/components/DeleteConfirm';
import { bookmarksApi } from '@/lib/api';
import { Plus, Bookmark, Loader2, AlertCircle } from 'lucide-react';

export default function BookmarksPage() {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBookmark, setEditingBookmark] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, bookmark: null });

    // Fetch bookmarks
    const fetchBookmarks = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = {};
            if (searchQuery) params.q = searchQuery;
            if (selectedTags.length > 0) params.tags = selectedTags.join(',');

            const response = await bookmarksApi.getAll(params);
            setBookmarks(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch bookmarks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookmarks();
    }, [searchQuery, selectedTags]);

    // Get all unique tags from bookmarks
    const allTags = useMemo(() => {
        const tags = new Set();
        bookmarks.forEach(bookmark => {
            bookmark.tags?.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    }, [bookmarks]);

    // Handle tag toggle
    const handleTagToggle = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    // Handle form submit (create/update)
    const handleFormSubmit = async (formData) => {
        try {
            setIsSubmitting(true);
            if (editingBookmark) {
                await bookmarksApi.update(editingBookmark._id, formData);
            } else {
                await bookmarksApi.create(formData);
            }
            setIsFormOpen(false);
            setEditingBookmark(null);
            fetchBookmarks();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to save bookmark');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle edit
    const handleEdit = (bookmark) => {
        setEditingBookmark(bookmark);
        setIsFormOpen(true);
    };

    // Handle delete
    const handleDelete = async () => {
        try {
            await bookmarksApi.delete(deleteConfirm.bookmark._id);
            setDeleteConfirm({ isOpen: false, bookmark: null });
            fetchBookmarks();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to delete bookmark');
        }
    };

    // Handle favorite toggle
    const handleToggleFavorite = async (bookmark) => {
        try {
            await bookmarksApi.update(bookmark._id, { favorite: !bookmark.favorite });
            fetchBookmarks();
        } catch (err) {
            console.error('Failed to update favorite status');
        }
    };

    // Handle modal close
    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingBookmark(null);
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
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                                    <Bookmark className="h-5 w-5 text-purple-400" />
                                </div>
                                Bookmarks
                            </h1>
                            <p className="text-dark-400 mt-1">
                                {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            New Bookmark
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className="space-y-4 mb-8">
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Search bookmarks..."
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
                            <p className="text-dark-300 mb-2">Failed to load bookmarks</p>
                            <p className="text-dark-500 text-sm mb-4">{error}</p>
                            <button onClick={fetchBookmarks} className="btn-secondary">
                                Try Again
                            </button>
                        </div>
                    ) : bookmarks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 rounded-2xl bg-dark-800/50 border border-dark-700 flex items-center justify-center mb-6">
                                <Bookmark className="h-10 w-10 text-dark-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-dark-300 mb-2">
                                {searchQuery || selectedTags.length > 0 ? 'No bookmarks found' : 'No bookmarks yet'}
                            </h3>
                            <p className="text-dark-500 mb-6 max-w-md">
                                {searchQuery || selectedTags.length > 0
                                    ? 'Try adjusting your search or filters'
                                    : 'Save your first bookmark to start building your collection'}
                            </p>
                            {!searchQuery && selectedTags.length === 0 && (
                                <button
                                    onClick={() => setIsFormOpen(true)}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Bookmark
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {bookmarks.map((bookmark) => (
                                <BookmarkCard
                                    key={bookmark._id}
                                    bookmark={bookmark}
                                    onEdit={handleEdit}
                                    onDelete={(bookmark) => setDeleteConfirm({ isOpen: true, bookmark })}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Form Modal */}
            <BookmarkForm
                isOpen={isFormOpen}
                onClose={handleFormClose}
                onSubmit={handleFormSubmit}
                initialData={editingBookmark}
                isSubmitting={isSubmitting}
            />

            {/* Delete Confirmation */}
            <DeleteConfirm
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, bookmark: null })}
                onConfirm={handleDelete}
                itemType="Bookmark"
                title={deleteConfirm.bookmark?.title || deleteConfirm.bookmark?.url}
            />
        </>
    );
}
