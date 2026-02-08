'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Plus, Loader2, FileText, AlignLeft } from 'lucide-react';

export default function NoteForm({ isOpen, onClose, onSubmit, initialData, isSubmitting }) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: [],
        favorite: false
    });
    const [tagInput, setTagInput] = useState('');
    const [lineCount, setLineCount] = useState(1);
    const textareaRef = useRef(null);
    const lineNumbersRef = useRef(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                content: initialData.content || '',
                tags: initialData.tags || [],
                favorite: initialData.favorite || false
            });
        } else {
            setFormData({ title: '', content: '', tags: [], favorite: false });
        }
        setTagInput('');
    }, [initialData, isOpen]);

    // Update line count when content changes
    useEffect(() => {
        const lines = formData.content.split('\n').length;
        setLineCount(Math.max(lines, 10));
    }, [formData.content]);

    // Sync scroll between line numbers and textarea
    const handleScroll = (e) => {
        if (lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = e.target.scrollTop;
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.max(280, textareaRef.current.scrollHeight) + 'px';
        }
    }, [formData.content]);

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

    // Handle Tab key for indentation
    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const newContent = formData.content.substring(0, start) + '    ' + formData.content.substring(end);
            setFormData({ ...formData, content: newContent });
            // Set cursor position after tab
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 4;
            }, 0);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-dark-700 bg-dark-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-purple-500/20 border border-primary-500/30 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-primary-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-dark-100">
                            {initialData ? 'Edit Note' : 'New Note'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-dark-500 hover:text-dark-300 hover:bg-dark-700 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    {/* Title Input - Clean notepad style */}
                    <div className="border-b border-dark-700/50">
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-5 py-4 bg-transparent text-xl font-semibold text-dark-100 placeholder-dark-500 focus:outline-none"
                            placeholder="Untitled Note"
                            required
                        />
                    </div>

                    {/* Content Editor - Notepad style with line numbers */}
                    <div className="relative flex bg-dark-950/50">
                        {/* Line Numbers */}
                        <div
                            ref={lineNumbersRef}
                            className="flex-shrink-0 w-12 py-4 pr-2 text-right select-none overflow-hidden bg-dark-900/30 border-r border-dark-700/30"
                            style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace" }}
                        >
                            {Array.from({ length: lineCount }, (_, i) => (
                                <div
                                    key={i + 1}
                                    className="text-xs text-dark-600 leading-6 h-6"
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>

                        {/* Text Area */}
                        <textarea
                            ref={textareaRef}
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            onScroll={handleScroll}
                            onKeyDown={handleKeyDown}
                            className="flex-1 w-full px-4 py-4 bg-transparent text-dark-200 placeholder-dark-600 focus:outline-none resize-none leading-6"
                            style={{
                                fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                                fontSize: '14px',
                                minHeight: '280px',
                                tabSize: 4
                            }}
                            placeholder="Start writing your note here...

• Use Tab for indentation
• Supports multiple lines
• Clean, distraction-free writing"
                            required
                        />
                    </div>

                    {/* Bottom Section - Metadata */}
                    <div className="p-4 space-y-4 border-t border-dark-700/50 bg-dark-800/30">
                        {/* Character & Word Count */}
                        <div className="flex items-center gap-4 text-xs text-dark-500">
                            <span className="flex items-center gap-1.5">
                                <AlignLeft className="h-3 w-3" />
                                {formData.content.split(/\s+/).filter(Boolean).length} words
                            </span>
                            <span>{formData.content.length} characters</span>
                            <span>{formData.content.split('\n').length} lines</span>
                        </div>

                        {/* Tags */}
                        <div>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    className="flex-1 px-3 py-2 bg-dark-800/70 border border-dark-700 rounded-lg text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500"
                                    placeholder="Add tags (press Enter)"
                                />
                                <button
                                    type="button"
                                    onClick={addTag}
                                    className="px-3 py-2 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg text-dark-300 transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {formData.tags.map((tag) => (
                                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-primary-500/20 text-primary-300 border border-primary-500/30">
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="hover:text-red-300 transition-colors"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Favorite Toggle */}
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={formData.favorite}
                                onChange={(e) => setFormData({ ...formData, favorite: e.target.checked })}
                                className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
                            />
                            <span className="text-sm text-dark-400 group-hover:text-dark-300 transition-colors">
                                ⭐ Mark as favorite
                            </span>
                        </label>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg text-dark-300 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-500/25 disabled:opacity-50"
                            >
                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                {initialData ? 'Save Changes' : 'Create Note'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
