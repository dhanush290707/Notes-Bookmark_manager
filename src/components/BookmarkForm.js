'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';

export default function BookmarkForm({ isOpen, onClose, onSubmit, initialData, isSubmitting }) {
    const [formData, setFormData] = useState({
        url: '',
        title: '',
        description: '',
        tags: [],
        favorite: false
    });
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData({
                url: initialData.url || '',
                title: initialData.title || '',
                description: initialData.description || '',
                tags: initialData.tags || [],
                favorite: initialData.favorite || false
            });
        } else {
            setFormData({ url: '', title: '', description: '', tags: [], favorite: false });
        }
        setTagInput('');
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const addTag = () => {
        const tag = tagInput.trim().toLowerCase();
        if (tag && !formData.tags.includes(tag)) {
            setFormData({ ...formData, tags: [...formData.tags, tag] });
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(t => t !== tagToRemove)
        });
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b border-dark-700">
                    <h2 className="text-lg font-semibold text-dark-100">
                        {initialData ? 'Edit Bookmark' : 'Create Bookmark'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-dark-500 hover:text-dark-300 hover:bg-dark-800 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">
                            URL <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="url"
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            className="input"
                            placeholder="https://example.com"
                            required
                        />
                        <p className="text-xs text-dark-500 mt-1">
                            Leave title empty to auto-fetch from URL
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="input"
                            placeholder="Enter bookmark title (optional)"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input min-h-[100px] resize-none"
                            placeholder="Add a description..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">
                            Tags
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                className="input flex-1"
                                placeholder="Add a tag and press Enter"
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="btn-secondary"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag) => (
                                    <span key={tag} className="tag flex items-center gap-1">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="hover:text-red-300"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="favorite"
                            checked={formData.favorite}
                            onChange={(e) => setFormData({ ...formData, favorite: e.target.checked })}
                            className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500"
                        />
                        <label htmlFor="favorite" className="text-sm text-dark-300">
                            Mark as favorite
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-dark-700">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary flex-1 flex items-center justify-center gap-2"
                        >
                            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            {initialData ? 'Update Bookmark' : 'Create Bookmark'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
