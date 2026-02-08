'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { notesApi } from '@/lib/api';
import {
    ArrowLeft,
    Save,
    Loader2,
    FileText,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Settings,
    X,
    Plus,
    Star,
    Clock,
    ChevronRight,
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Type,
    Palette,
    Highlighter,
    Minus,
    ChevronDown
} from 'lucide-react';

// Font options
const FONTS = [
    { name: 'Monospace', value: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace" },
    { name: 'Courier', value: "'Courier New', monospace" },
    { name: 'Sans Serif', value: "'Inter', 'Segoe UI', sans-serif" },
    { name: 'Serif', value: "'Georgia', 'Times New Roman', serif" },
    { name: 'System', value: "system-ui, sans-serif" },
];

// Font sizes
const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32];

// Text colors
const TEXT_COLORS = [
    { name: 'Default', value: '#e2e8f0' },
    { name: 'White', value: '#ffffff' },
    { name: 'Gray', value: '#94a3b8' },
    { name: 'Red', value: '#f87171' },
    { name: 'Orange', value: '#fb923c' },
    { name: 'Yellow', value: '#facc15' },
    { name: 'Green', value: '#4ade80' },
    { name: 'Blue', value: '#60a5fa' },
    { name: 'Purple', value: '#a78bfa' },
    { name: 'Pink', value: '#f472b6' },
];

// Highlight colors
const HIGHLIGHT_COLORS = [
    { name: 'None', value: 'transparent' },
    { name: 'Yellow', value: 'rgba(250, 204, 21, 0.3)' },
    { name: 'Green', value: 'rgba(74, 222, 128, 0.3)' },
    { name: 'Blue', value: 'rgba(96, 165, 250, 0.3)' },
    { name: 'Purple', value: 'rgba(167, 139, 250, 0.3)' },
    { name: 'Pink', value: 'rgba(244, 114, 182, 0.3)' },
    { name: 'Red', value: 'rgba(248, 113, 113, 0.3)' },
];

// Dropdown component
function Dropdown({ trigger, children, isOpen, onToggle }) {
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onToggle(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen, onToggle]);

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={() => onToggle(!isOpen)}>
                {trigger}
            </div>
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-dark-800 border border-dark-700 rounded-lg shadow-xl z-50 py-1 min-w-[120px]">
                    {children}
                </div>
            )}
        </div>
    );
}

function NoteEditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('id');

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: [],
        favorite: false
    });

    // Editor styling state
    const [editorStyle, setEditorStyle] = useState({
        fontFamily: FONTS[0].value,
        fontSize: 14,
        textColor: TEXT_COLORS[0].value,
        highlightColor: HIGHLIGHT_COLORS[0].value,
        lineHeight: 1.75,
        textAlign: 'left'
    });

    const [tagInput, setTagInput] = useState('');
    const [lineCount, setLineCount] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(!!editId);
    const [showPanel, setShowPanel] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    // Active dropdown
    const [activeDropdown, setActiveDropdown] = useState(null);

    const textareaRef = useRef(null);
    const lineNumbersRef = useRef(null);

    // Load note if editing
    useEffect(() => {
        if (editId) {
            loadNote();
        }
    }, [editId]);

    // Load saved editor preferences
    useEffect(() => {
        const saved = localStorage.getItem('noteEditorStyle');
        if (saved) {
            try {
                setEditorStyle(prev => ({ ...prev, ...JSON.parse(saved) }));
            } catch (e) {
                console.error('Failed to load editor preferences');
            }
        }
    }, []);

    // Save editor preferences
    useEffect(() => {
        localStorage.setItem('noteEditorStyle', JSON.stringify(editorStyle));
    }, [editorStyle]);

    const loadNote = async () => {
        try {
            setIsLoading(true);
            const response = await notesApi.getById(editId);
            setFormData({
                title: response.data.title || '',
                content: response.data.content || '',
                tags: response.data.tags || [],
                favorite: response.data.favorite || false
            });
            setLastSaved(new Date(response.data.updatedAt));
        } catch (error) {
            alert('Failed to load note');
            router.push('/notes');
        } finally {
            setIsLoading(false);
        }
    };

    // Update line count when content changes
    useEffect(() => {
        const lines = formData.content.split('\n').length;
        setLineCount(Math.max(lines, 20));
    }, [formData.content]);

    // Sync scroll between line numbers and textarea
    const handleScroll = (e) => {
        if (lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = e.target.scrollTop;
        }
    };

    // Handle keyboard shortcuts
    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            insertAtCursor('    ');
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            handleSave();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            wrapSelection('**', '**');
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
            e.preventDefault();
            wrapSelection('_', '_');
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            wrapSelection('<u>', '</u>');
        }
    };

    // Insert text at cursor position
    const insertAtCursor = (text) => {
        if (!textareaRef.current) return;
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = formData.content.substring(0, start) + text + formData.content.substring(end);
        setFormData({ ...formData, content: newContent });
        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + text.length;
        }, 0);
    };

    // Wrap selected text with markers
    const wrapSelection = (before, after) => {
        if (!textareaRef.current) return;
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = formData.content.substring(start, end);
        const newContent = formData.content.substring(0, start) + before + selectedText + after + formData.content.substring(end);
        setFormData({ ...formData, content: newContent });
        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = start + before.length;
            textarea.selectionEnd = end + before.length;
        }, 0);
    };

    // Insert list marker at line start
    const insertListMarker = (marker) => {
        if (!textareaRef.current) return;
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const beforeCursor = formData.content.substring(0, start);
        const lineStart = beforeCursor.lastIndexOf('\n') + 1;
        const newContent = formData.content.substring(0, lineStart) + marker + ' ' + formData.content.substring(lineStart);
        setFormData({ ...formData, content: newContent });
        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + marker.length + 1;
        }, 0);
    };

    const handleSave = async () => {
        if (!formData.title.trim() || !formData.content.trim()) {
            alert('Title and content are required');
            return;
        }

        try {
            setIsSaving(true);
            if (editId) {
                await notesApi.update(editId, formData);
            } else {
                await notesApi.create(formData);
            }
            // Navigate back to notes list after save
            router.push('/notes');
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to save note');
            setIsSaving(false);
        }
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

    const updateStyle = (key, value) => {
        setEditorStyle(prev => ({ ...prev, [key]: value }));
        setActiveDropdown(null);
    };

    const wordCount = formData.content.split(/\s+/).filter(Boolean).length;
    const charCount = formData.content.length;
    const lineCountDisplay = formData.content.split('\n').length;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex flex-col">
            {/* Top Bar */}
            <header className="sticky top-0 z-40 border-b border-dark-800/50 bg-dark-900/90 backdrop-blur-xl">
                <div className="flex items-center justify-between px-4 h-14">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/notes"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800/50 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline text-sm">Notes</span>
                        </Link>
                        <div className="w-px h-6 bg-dark-700" />
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary-400" />
                            <span className="text-sm text-dark-300 truncate max-w-[200px]">
                                {formData.title || 'Untitled Note'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {lastSaved && (
                            <span className="hidden sm:flex items-center gap-1.5 text-xs text-dark-500">
                                <Clock className="h-3 w-3" />
                                Saved {lastSaved.toLocaleTimeString()}
                            </span>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-lg text-white text-sm font-medium transition-all shadow-lg shadow-primary-500/25 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            <span className="hidden sm:inline">Save</span>
                        </button>
                        <button
                            onClick={() => setShowPanel(!showPanel)}
                            className={`p-2 rounded-lg transition-colors ${showPanel ? 'bg-primary-500/20 text-primary-400' : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800/50'}`}
                        >
                            <Settings className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Formatting Toolbar */}
            <div className="border-b border-dark-800/50 bg-dark-900/70 px-4 py-2">
                <div className="flex items-center gap-1 flex-wrap">
                    {/* Font Family Dropdown */}
                    <Dropdown
                        isOpen={activeDropdown === 'font'}
                        onToggle={(open) => setActiveDropdown(open ? 'font' : null)}
                        trigger={
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-dark-300 hover:bg-dark-800 transition-colors border border-dark-700">
                                <Type className="h-4 w-4" />
                                <span className="hidden sm:inline max-w-[80px] truncate">
                                    {FONTS.find(f => f.value === editorStyle.fontFamily)?.name || 'Font'}
                                </span>
                                <ChevronDown className="h-3 w-3" />
                            </button>
                        }
                    >
                        {FONTS.map((font) => (
                            <button
                                key={font.name}
                                onClick={() => updateStyle('fontFamily', font.value)}
                                className={`w-full px-3 py-2 text-left text-sm hover:bg-dark-700 transition-colors ${editorStyle.fontFamily === font.value ? 'text-primary-400 bg-dark-700/50' : 'text-dark-300'}`}
                                style={{ fontFamily: font.value }}
                            >
                                {font.name}
                            </button>
                        ))}
                    </Dropdown>

                    {/* Font Size Dropdown */}
                    <Dropdown
                        isOpen={activeDropdown === 'size'}
                        onToggle={(open) => setActiveDropdown(open ? 'size' : null)}
                        trigger={
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-dark-300 hover:bg-dark-800 transition-colors border border-dark-700 min-w-[70px]">
                                <span>{editorStyle.fontSize}px</span>
                                <ChevronDown className="h-3 w-3" />
                            </button>
                        }
                    >
                        <div className="max-h-48 overflow-auto">
                            {FONT_SIZES.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => updateStyle('fontSize', size)}
                                    className={`w-full px-3 py-1.5 text-left text-sm hover:bg-dark-700 transition-colors ${editorStyle.fontSize === size ? 'text-primary-400 bg-dark-700/50' : 'text-dark-300'}`}
                                >
                                    {size}px
                                </button>
                            ))}
                        </div>
                    </Dropdown>

                    <div className="w-px h-6 bg-dark-700 mx-1" />

                    {/* Bold, Italic, Underline */}
                    <button
                        onClick={() => wrapSelection('**', '**')}
                        className="p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors"
                        title="Bold (Ctrl+B)"
                    >
                        <Bold className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => wrapSelection('_', '_')}
                        className="p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors"
                        title="Italic (Ctrl+I)"
                    >
                        <Italic className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => wrapSelection('<u>', '</u>')}
                        className="p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors"
                        title="Underline (Ctrl+U)"
                    >
                        <Underline className="h-4 w-4" />
                    </button>

                    <div className="w-px h-6 bg-dark-700 mx-1" />

                    {/* Text Color Dropdown */}
                    <Dropdown
                        isOpen={activeDropdown === 'color'}
                        onToggle={(open) => setActiveDropdown(open ? 'color' : null)}
                        trigger={
                            <button className="flex items-center gap-1.5 p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors" title="Text Color">
                                <Palette className="h-4 w-4" />
                                <div className="w-4 h-4 rounded border border-dark-600" style={{ backgroundColor: editorStyle.textColor }} />
                            </button>
                        }
                    >
                        <div className="p-2 w-48">
                            <p className="text-xs text-dark-500 mb-2">Text Color</p>
                            <div className="grid grid-cols-5 gap-1.5">
                                {TEXT_COLORS.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => updateStyle('textColor', color.value)}
                                        className={`w-7 h-7 rounded-md border-2 transition-all ${editorStyle.textColor === color.value ? 'border-primary-500 scale-110' : 'border-dark-600 hover:border-dark-500'}`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>
                    </Dropdown>

                    {/* Highlight Color Dropdown */}
                    <Dropdown
                        isOpen={activeDropdown === 'highlight'}
                        onToggle={(open) => setActiveDropdown(open ? 'highlight' : null)}
                        trigger={
                            <button className="flex items-center gap-1.5 p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors" title="Highlight">
                                <Highlighter className="h-4 w-4" />
                                <div
                                    className="w-4 h-4 rounded border border-dark-600"
                                    style={{ backgroundColor: editorStyle.highlightColor === 'transparent' ? '#374151' : editorStyle.highlightColor }}
                                />
                            </button>
                        }
                    >
                        <div className="p-2 w-44">
                            <p className="text-xs text-dark-500 mb-2">Highlight</p>
                            <div className="grid grid-cols-4 gap-1.5">
                                {HIGHLIGHT_COLORS.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => updateStyle('highlightColor', color.value)}
                                        className={`w-8 h-8 rounded-md border-2 transition-all flex items-center justify-center ${editorStyle.highlightColor === color.value ? 'border-primary-500 scale-110' : 'border-dark-600 hover:border-dark-500'}`}
                                        style={{ backgroundColor: color.value === 'transparent' ? '#1f2937' : color.value }}
                                        title={color.name}
                                    >
                                        {color.value === 'transparent' && <X className="h-3 w-3 text-dark-500" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Dropdown>

                    <div className="w-px h-6 bg-dark-700 mx-1" />

                    {/* Lists */}
                    <button
                        onClick={() => insertListMarker('•')}
                        className="p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors"
                        title="Bullet List"
                    >
                        <List className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => insertListMarker('1.')}
                        className="p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors"
                        title="Numbered List"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </button>

                    <div className="w-px h-6 bg-dark-700 mx-1" />

                    {/* Text Alignment */}
                    {['left', 'center', 'right'].map((align) => {
                        const Icon = align === 'left' ? AlignLeft : align === 'center' ? AlignCenter : AlignRight;
                        return (
                            <button
                                key={align}
                                onClick={() => updateStyle('textAlign', align)}
                                className={`p-2 rounded-lg transition-colors ${editorStyle.textAlign === align ? 'bg-dark-700 text-primary-400' : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800'}`}
                                title={`Align ${align}`}
                            >
                                <Icon className="h-4 w-4" />
                            </button>
                        );
                    })}

                    <div className="w-px h-6 bg-dark-700 mx-1" />

                    {/* Line Height */}
                    <div className="flex items-center gap-1 text-dark-400">
                        <button
                            onClick={() => updateStyle('lineHeight', Math.max(1.25, editorStyle.lineHeight - 0.25))}
                            className="p-1.5 rounded hover:bg-dark-800 transition-colors"
                            title="Decrease line height"
                        >
                            <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs w-10 text-center">{editorStyle.lineHeight.toFixed(2)}</span>
                        <button
                            onClick={() => updateStyle('lineHeight', Math.min(3, editorStyle.lineHeight + 0.25))}
                            className="p-1.5 rounded hover:bg-dark-800 transition-colors"
                            title="Increase line height"
                        >
                            <Plus className="h-3 w-3" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Editor Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Title Input */}
                    <div className="border-b border-dark-800/30">
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-6 py-4 bg-transparent text-2xl font-bold text-dark-100 placeholder-dark-600 focus:outline-none"
                            placeholder="Untitled Note"
                            style={{ fontFamily: editorStyle.fontFamily }}
                        />
                    </div>

                    {/* Content Editor */}
                    <div className="flex-1 flex overflow-hidden" style={{ backgroundColor: editorStyle.highlightColor }}>
                        {/* Line Numbers */}
                        <div
                            ref={lineNumbersRef}
                            className="flex-shrink-0 w-14 py-4 pr-3 text-right select-none overflow-hidden bg-dark-900/40 border-r border-dark-800/30"
                            style={{ fontFamily: editorStyle.fontFamily }}
                        >
                            {Array.from({ length: lineCount }, (_, i) => (
                                <div
                                    key={i + 1}
                                    className="text-xs text-dark-600"
                                    style={{
                                        lineHeight: editorStyle.lineHeight,
                                        height: `${editorStyle.fontSize * editorStyle.lineHeight}px`
                                    }}
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>

                        {/* Textarea */}
                        <textarea
                            ref={textareaRef}
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            onScroll={handleScroll}
                            onKeyDown={handleKeyDown}
                            className="flex-1 w-full px-4 py-4 bg-transparent placeholder-dark-600 focus:outline-none resize-none overflow-auto"
                            style={{
                                fontFamily: editorStyle.fontFamily,
                                fontSize: `${editorStyle.fontSize}px`,
                                color: editorStyle.textColor,
                                lineHeight: editorStyle.lineHeight,
                                textAlign: editorStyle.textAlign,
                                tabSize: 4
                            }}
                            placeholder="Start writing your note...

Shortcuts:
• Ctrl+S - Save
• Ctrl+B - Bold (**text**)
• Ctrl+I - Italic (_text_)
• Ctrl+U - Underline
• Tab - Indent"
                        />
                    </div>

                    {/* Status Bar */}
                    <div className="flex items-center justify-between px-6 py-2 border-t border-dark-800/30 bg-dark-900/30">
                        <div className="flex items-center gap-4 text-xs text-dark-500">
                            <span>{wordCount} words</span>
                            <span>{charCount} chars</span>
                            <span>{lineCountDisplay} lines</span>
                        </div>
                        {formData.favorite && (
                            <span className="flex items-center gap-1 text-xs text-amber-400">
                                <Star className="h-3 w-3" fill="currentColor" />
                                Favorite
                            </span>
                        )}
                    </div>
                </div>

                {/* Settings Side Panel */}
                <div className={`border-l border-dark-800/50 bg-dark-900/50 transition-all duration-300 overflow-hidden ${showPanel ? 'w-80' : 'w-0'}`}>
                    <div className="w-80 h-full flex flex-col">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-dark-800/50">
                            <h3 className="font-medium text-dark-200">Settings</h3>
                            <button onClick={() => setShowPanel(false)} className="p-1 rounded hover:bg-dark-800 text-dark-500 hover:text-dark-300">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto p-4 space-y-6">
                            {/* Favorite */}
                            <label className="flex items-center justify-between p-3 rounded-lg bg-dark-800/50 border border-dark-700/50 cursor-pointer hover:border-dark-600">
                                <div className="flex items-center gap-3">
                                    <Star className={`h-5 w-5 ${formData.favorite ? 'text-amber-400' : 'text-dark-500'}`} fill={formData.favorite ? 'currentColor' : 'none'} />
                                    <span className="text-sm text-dark-300">Favorite</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.favorite}
                                    onChange={(e) => setFormData({ ...formData, favorite: e.target.checked })}
                                    className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-amber-500 focus:ring-amber-500"
                                />
                            </label>

                            {/* Tags */}
                            <div>
                                <h4 className="text-sm font-medium text-dark-300 mb-3">Tags</h4>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagKeyDown}
                                        className="flex-1 px-3 py-2 bg-dark-800/70 border border-dark-700 rounded-lg text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                                        placeholder="Add tag..."
                                    />
                                    <button onClick={addTag} className="px-3 py-2 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg text-dark-300">
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                {formData.tags.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag) => (
                                            <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-300 border border-primary-500/30">
                                                #{tag}
                                                <button onClick={() => removeTag(tag)} className="hover:text-red-300"><X className="h-3 w-3" /></button>
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-dark-500">No tags yet</p>
                                )}
                            </div>

                            {/* Stats */}
                            <div>
                                <h4 className="text-sm font-medium text-dark-300 mb-3">Statistics</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-dark-400"><span>Words</span><span className="text-dark-300">{wordCount}</span></div>
                                    <div className="flex justify-between text-dark-400"><span>Characters</span><span className="text-dark-300">{charCount}</span></div>
                                    <div className="flex justify-between text-dark-400"><span>Lines</span><span className="text-dark-300">{lineCountDisplay}</span></div>
                                    {lastSaved && (
                                        <div className="flex justify-between text-dark-400 pt-2 border-t border-dark-700/50">
                                            <span>Last saved</span><span className="text-dark-300">{lastSaved.toLocaleTimeString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-dark-800/50">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-lg text-white font-medium flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save Note
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Wrap with Suspense for useSearchParams
export default function NoteEditorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
            </div>
        }>
            <NoteEditorContent />
        </Suspense>
    );
}
