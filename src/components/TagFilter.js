'use client';

import { X } from 'lucide-react';

export default function TagFilter({ tags, selectedTags, onToggle, onClear }) {
    if (!tags || tags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-dark-500">Tags:</span>
            {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                    <button
                        key={tag}
                        onClick={() => onToggle(tag)}
                        className={`tag-input ${isSelected ? 'bg-primary-500/30 text-primary-300 border-primary-500/50' : ''
                            }`}
                    >
                        {tag}
                    </button>
                );
            })}
            {selectedTags.length > 0 && (
                <button
                    onClick={onClear}
                    className="text-xs text-dark-500 hover:text-dark-300 flex items-center gap-1"
                >
                    <X className="h-3 w-3" />
                    Clear
                </button>
            )}
        </div>
    );
}
