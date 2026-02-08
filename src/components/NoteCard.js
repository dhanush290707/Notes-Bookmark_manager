'use client';

import { Star, Edit2, Trash2 } from 'lucide-react';

export default function NoteCard({ note, onEdit, onDelete, onToggleFavorite }) {
    return (
        <div className="card animate-fade-in group">
            <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="font-semibold text-dark-100 line-clamp-1 flex-1">
                    {note.title}
                </h3>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onToggleFavorite(note)}
                        className={`favorite-btn ${note.favorite ? 'favorite-active' : 'favorite-inactive'}`}
                        title={note.favorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <Star className="h-4 w-4" fill={note.favorite ? 'currentColor' : 'none'} />
                    </button>
                    <button
                        onClick={() => onEdit(note)}
                        className="p-1.5 rounded-lg text-dark-500 hover:text-primary-400 hover:bg-primary-500/20 transition-all"
                        title="Edit note"
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(note)}
                        className="p-1.5 rounded-lg text-dark-500 hover:text-red-400 hover:bg-red-500/20 transition-all"
                        title="Delete note"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <p className="text-dark-400 text-sm line-clamp-3 mb-4">
                {note.content}
            </p>

            {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {note.tags.map((tag) => (
                        <span key={tag} className="tag">
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="mt-4 pt-3 border-t border-dark-700/50 flex items-center justify-between">
                <span className="text-xs text-dark-500">
                    {new Date(note.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </span>
                {note.favorite && (
                    <Star className="h-3.5 w-3.5 text-amber-400" fill="currentColor" />
                )}
            </div>
        </div>
    );
}
