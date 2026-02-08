'use client';

import { Star, Edit2, Trash2, ExternalLink, Link2 } from 'lucide-react';

export default function BookmarkCard({ bookmark, onEdit, onDelete, onToggleFavorite }) {
    // Extract domain from URL
    const getDomain = (url) => {
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return url;
        }
    };

    return (
        <div className="card animate-fade-in group">
            <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500/20 to-purple-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
                        <Link2 className="h-5 w-5 text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-dark-100 line-clamp-1">
                            {bookmark.title || getDomain(bookmark.url)}
                        </h3>
                        <p className="text-xs text-dark-500 truncate">
                            {getDomain(bookmark.url)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                        onClick={() => onToggleFavorite(bookmark)}
                        className={`favorite-btn ${bookmark.favorite ? 'favorite-active' : 'favorite-inactive'}`}
                        title={bookmark.favorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <Star className="h-4 w-4" fill={bookmark.favorite ? 'currentColor' : 'none'} />
                    </button>
                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-dark-500 hover:text-green-400 hover:bg-green-500/20 transition-all"
                        title="Open link"
                    >
                        <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                        onClick={() => onEdit(bookmark)}
                        className="p-1.5 rounded-lg text-dark-500 hover:text-primary-400 hover:bg-primary-500/20 transition-all"
                        title="Edit bookmark"
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(bookmark)}
                        className="p-1.5 rounded-lg text-dark-500 hover:text-red-400 hover:bg-red-500/20 transition-all"
                        title="Delete bookmark"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {bookmark.description && (
                <p className="text-dark-400 text-sm line-clamp-2 mb-4">
                    {bookmark.description}
                </p>
            )}

            {bookmark.tags && bookmark.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {bookmark.tags.map((tag) => (
                        <span key={tag} className="tag">
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="mt-4 pt-3 border-t border-dark-700/50 flex items-center justify-between">
                <span className="text-xs text-dark-500">
                    {new Date(bookmark.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </span>
                {bookmark.favorite && (
                    <Star className="h-3.5 w-3.5 text-amber-400" fill="currentColor" />
                )}
            </div>
        </div>
    );
}
