'use client';

import { X, AlertTriangle } from 'lucide-react';

export default function DeleteConfirm({ isOpen, onClose, onConfirm, itemType = 'item', title }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content max-w-sm" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-dark-100 mb-2">
                        Delete {itemType}?
                    </h3>
                    <p className="text-dark-400 text-sm mb-1">
                        Are you sure you want to delete
                    </p>
                    <p className="text-dark-200 font-medium mb-4 truncate">
                        "{title}"
                    </p>
                    <p className="text-dark-500 text-xs mb-6">
                        This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="btn-secondary flex-1">
                            Cancel
                        </button>
                        <button onClick={onConfirm} className="btn-danger flex-1">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
