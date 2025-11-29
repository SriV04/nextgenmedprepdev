import React from 'react';
import { Check, X } from 'lucide-react';

interface SelectionToolbarProps {
  selectedCount: number;
  hasEmptySlots: boolean;
  hasExistingSlots: boolean;
  onMarkAvailable: () => void;
  onRemoveAvailability: () => void;
  onClear: () => void;
}

export const SelectionToolbar: React.FC<SelectionToolbarProps> = ({
  selectedCount,
  hasEmptySlots,
  hasExistingSlots,
  onMarkAvailable,
  onRemoveAvailability,
  onClear,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <span className="font-medium">
          {selectedCount} slot{selectedCount > 1 ? 's' : ''} selected
        </span>
        <div className="h-4 w-px bg-blue-400"></div>
        <span className="text-sm text-blue-100">
          Drag to select multiple • Click individual slots to toggle
        </span>
      </div>
      <div className="flex items-center gap-2">
        {hasEmptySlots && (
          <button
            onClick={onMarkAvailable}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium text-sm"
          >
            <Check className="w-4 h-4" />
            Mark as Available
          </button>
        )}
        {hasExistingSlots && (
          <button
            onClick={onRemoveAvailability}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium text-sm"
          >
            <X className="w-4 h-4" />
            Remove Availability
          </button>
        )}
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
        >
          <X className="w-4 h-4" />
          Clear
        </button>
      </div>
    </div>
  );
};
