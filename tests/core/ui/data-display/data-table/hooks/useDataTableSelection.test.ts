/**
 * useDataTableSelection Tests
 *
 * Tests for the useDataTableSelection hook:
 * - Initial state setup
 * - Row selection (toggle, select, deselect)
 * - Select all functionality
 * - Selection state checks
 * - Selection change callbacks
 * - Edge cases
 */

import { useDataTableSelection } from '@core/ui/data-display/data-table/hooks/useDataTableSelection';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useDataTableSelection', () => {
	describe('initial state', () => {
		it('should initialize with empty selection', () => {
			const { result } = renderHook(() => useDataTableSelection({}));

			expect(result.current.selectedRowIds.size).toBe(0);
			expect(result.current.selectedCount).toBe(0);
		});

		it('should initialize with provided initialSelectedIds', () => {
			const initialSelectedIds = ['row-1', 'row-2', 'row-3'];
			const { result } = renderHook(() => useDataTableSelection({ initialSelectedIds }));

			expect(result.current.selectedRowIds.size).toBe(3);
			expect(result.current.selectedCount).toBe(3);
			expect(result.current.isSelected('row-1')).toBe(true);
			expect(result.current.isSelected('row-2')).toBe(true);
			expect(result.current.isSelected('row-3')).toBe(true);
		});

		it('should handle empty initialSelectedIds array', () => {
			const { result } = renderHook(() => useDataTableSelection({ initialSelectedIds: [] }));

			expect(result.current.selectedRowIds.size).toBe(0);
			expect(result.current.selectedCount).toBe(0);
		});
	});

	describe('isSelected', () => {
		it('should return false for unselected row', () => {
			const { result } = renderHook(() => useDataTableSelection({}));

			expect(result.current.isSelected('row-1')).toBe(false);
		});

		it('should return true for selected row', () => {
			const { result } = renderHook(() => useDataTableSelection({ initialSelectedIds: ['row-1'] }));

			expect(result.current.isSelected('row-1')).toBe(true);
		});

		it('should return false for row not in selection', () => {
			const { result } = renderHook(() => useDataTableSelection({ initialSelectedIds: ['row-1'] }));

			expect(result.current.isSelected('row-2')).toBe(false);
		});
	});

	describe('isAllSelected', () => {
		it('should return false when no rows are selected', () => {
			const { result } = renderHook(() => useDataTableSelection({}));

			expect(result.current.isAllSelected(['row-1', 'row-2'])).toBe(false);
		});

		it('should return false when some rows are selected', () => {
			const { result } = renderHook(() => useDataTableSelection({ initialSelectedIds: ['row-1'] }));

			expect(result.current.isAllSelected(['row-1', 'row-2'])).toBe(false);
		});

		it('should return true when all rows are selected', () => {
			const { result } = renderHook(() =>
				useDataTableSelection({ initialSelectedIds: ['row-1', 'row-2'] })
			);

			expect(result.current.isAllSelected(['row-1', 'row-2'])).toBe(true);
		});

		it('should return false when empty rowIds array', () => {
			const { result } = renderHook(() => useDataTableSelection({}));

			expect(result.current.isAllSelected([])).toBe(false);
		});

		it('should return true when all rowIds are selected even if selection has extra rows', () => {
			const { result } = renderHook(() =>
				useDataTableSelection({ initialSelectedIds: ['row-1', 'row-2', 'row-3'] })
			);

			// isAllSelected checks if all provided rowIds are selected, not if selection matches exactly
			expect(result.current.isAllSelected(['row-1', 'row-2'])).toBe(true);
		});
	});

	describe('isSomeSelected', () => {
		it('should return false when no rows are selected', () => {
			const { result } = renderHook(() => useDataTableSelection({}));

			expect(result.current.isSomeSelected(['row-1', 'row-2'])).toBe(false);
		});

		it('should return true when some rows are selected', () => {
			const { result } = renderHook(() => useDataTableSelection({ initialSelectedIds: ['row-1'] }));

			expect(result.current.isSomeSelected(['row-1', 'row-2'])).toBe(true);
		});

		it('should return false when all rows are selected', () => {
			const { result } = renderHook(() =>
				useDataTableSelection({ initialSelectedIds: ['row-1', 'row-2'] })
			);

			expect(result.current.isSomeSelected(['row-1', 'row-2'])).toBe(false);
		});

		it('should return false when empty rowIds array', () => {
			const { result } = renderHook(() => useDataTableSelection({}));

			expect(result.current.isSomeSelected([])).toBe(false);
		});
	});

	describe('toggleRow', () => {
		it('should select row when not selected', () => {
			const { result } = renderHook(() => useDataTableSelection({}));

			act(() => {
				result.current.toggleRow('row-1');
			});

			expect(result.current.isSelected('row-1')).toBe(true);
			expect(result.current.selectedCount).toBe(1);
		});

		it('should deselect row when selected', () => {
			const { result } = renderHook(() => useDataTableSelection({ initialSelectedIds: ['row-1'] }));

			act(() => {
				result.current.toggleRow('row-1');
			});

			expect(result.current.isSelected('row-1')).toBe(false);
			expect(result.current.selectedCount).toBe(0);
		});

		it('should toggle multiple rows independently', () => {
			const { result } = renderHook(() => useDataTableSelection({}));

			act(() => {
				result.current.toggleRow('row-1');
			});

			act(() => {
				result.current.toggleRow('row-2');
			});

			expect(result.current.isSelected('row-1')).toBe(true);
			expect(result.current.isSelected('row-2')).toBe(true);
			expect(result.current.selectedCount).toBe(2);
		});
	});

	describe('selectRow', () => {
		it('should select unselected row', () => {
			const { result } = renderHook(() => useDataTableSelection({}));

			act(() => {
				result.current.selectRow('row-1');
			});

			expect(result.current.isSelected('row-1')).toBe(true);
			expect(result.current.selectedCount).toBe(1);
		});

		it('should keep row selected when already selected', () => {
			const { result } = renderHook(() => useDataTableSelection({ initialSelectedIds: ['row-1'] }));

			act(() => {
				result.current.selectRow('row-1');
			});

			expect(result.current.isSelected('row-1')).toBe(true);
			expect(result.current.selectedCount).toBe(1);
		});

		it('should select multiple rows', () => {
			const { result } = renderHook(() => useDataTableSelection({}));

			act(() => {
				result.current.selectRow('row-1');
			});

			act(() => {
				result.current.selectRow('row-2');
			});

			expect(result.current.isSelected('row-1')).toBe(true);
			expect(result.current.isSelected('row-2')).toBe(true);
			expect(result.current.selectedCount).toBe(2);
		});
	});

	describe('deselectRow', () => {
		it('should deselect selected row', () => {
			const { result } = renderHook(() => useDataTableSelection({ initialSelectedIds: ['row-1'] }));

			act(() => {
				result.current.deselectRow('row-1');
			});

			expect(result.current.isSelected('row-1')).toBe(false);
			expect(result.current.selectedCount).toBe(0);
		});

		it('should keep row unselected when already unselected', () => {
			const { result } = renderHook(() => useDataTableSelection({}));

			act(() => {
				result.current.deselectRow('row-1');
			});

			expect(result.current.isSelected('row-1')).toBe(false);
			expect(result.current.selectedCount).toBe(0);
		});

		it('should deselect multiple rows', () => {
			const { result } = renderHook(() =>
				useDataTableSelection({ initialSelectedIds: ['row-1', 'row-2'] })
			);

			act(() => {
				result.current.deselectRow('row-1');
			});

			act(() => {
				result.current.deselectRow('row-2');
			});

			expect(result.current.isSelected('row-1')).toBe(false);
			expect(result.current.isSelected('row-2')).toBe(false);
			expect(result.current.selectedCount).toBe(0);
		});
	});

	describe('selectAll', () => {
		it('should select all rows in array', () => {
			const { result } = renderHook(() => useDataTableSelection({}));

			act(() => {
				result.current.selectAll(['row-1', 'row-2', 'row-3']);
			});

			expect(result.current.isSelected('row-1')).toBe(true);
			expect(result.current.isSelected('row-2')).toBe(true);
			expect(result.current.isSelected('row-3')).toBe(true);
			expect(result.current.selectedCount).toBe(3);
		});

		it('should select all rows even when some are already selected', () => {
			const { result } = renderHook(() => useDataTableSelection({ initialSelectedIds: ['row-1'] }));

			act(() => {
				result.current.selectAll(['row-1', 'row-2', 'row-3']);
			});

			expect(result.current.isSelected('row-1')).toBe(true);
			expect(result.current.isSelected('row-2')).toBe(true);
			expect(result.current.isSelected('row-3')).toBe(true);
			expect(result.current.selectedCount).toBe(3);
		});

		it('should handle empty array', () => {
			const { result } = renderHook(() => useDataTableSelection({}));

			act(() => {
				result.current.selectAll([]);
			});

			expect(result.current.selectedCount).toBe(0);
		});
	});

	describe('toggleAll', () => {
		it('should select all rows when none are selected', () => {
			const { result } = renderHook(() => useDataTableSelection({}));

			act(() => {
				result.current.toggleAll(['row-1', 'row-2', 'row-3']);
			});

			expect(result.current.isSelected('row-1')).toBe(true);
			expect(result.current.isSelected('row-2')).toBe(true);
			expect(result.current.isSelected('row-3')).toBe(true);
			expect(result.current.selectedCount).toBe(3);
		});

		it('should deselect all rows when all are selected', () => {
			const { result } = renderHook(() =>
				useDataTableSelection({ initialSelectedIds: ['row-1', 'row-2', 'row-3'] })
			);

			act(() => {
				result.current.toggleAll(['row-1', 'row-2', 'row-3']);
			});

			expect(result.current.isSelected('row-1')).toBe(false);
			expect(result.current.isSelected('row-2')).toBe(false);
			expect(result.current.isSelected('row-3')).toBe(false);
			expect(result.current.selectedCount).toBe(0);
		});

		it('should select all rows when some are selected', () => {
			const { result } = renderHook(() => useDataTableSelection({ initialSelectedIds: ['row-1'] }));

			act(() => {
				result.current.toggleAll(['row-1', 'row-2', 'row-3']);
			});

			expect(result.current.isSelected('row-1')).toBe(true);
			expect(result.current.isSelected('row-2')).toBe(true);
			expect(result.current.isSelected('row-3')).toBe(true);
			expect(result.current.selectedCount).toBe(3);
		});

		it('should handle empty array', () => {
			const { result } = renderHook(() => useDataTableSelection({}));

			act(() => {
				result.current.toggleAll([]);
			});

			expect(result.current.selectedCount).toBe(0);
		});
	});

	describe('clearSelection', () => {
		it('should clear all selections', () => {
			const { result } = renderHook(() =>
				useDataTableSelection({ initialSelectedIds: ['row-1', 'row-2', 'row-3'] })
			);

			act(() => {
				result.current.clearSelection();
			});

			expect(result.current.selectedCount).toBe(0);
			expect(result.current.isSelected('row-1')).toBe(false);
			expect(result.current.isSelected('row-2')).toBe(false);
			expect(result.current.isSelected('row-3')).toBe(false);
		});

		it('should handle clearing when already empty', () => {
			const { result } = renderHook(() => useDataTableSelection({}));

			act(() => {
				result.current.clearSelection();
			});

			expect(result.current.selectedCount).toBe(0);
		});
	});

	describe('onSelectionChange callback', () => {
		it('should call onSelectionChange when row is toggled', () => {
			const onSelectionChange = vi.fn();
			const { result } = renderHook(() => useDataTableSelection({ onSelectionChange }));

			act(() => {
				result.current.toggleRow('row-1');
			});

			expect(onSelectionChange).toHaveBeenCalledTimes(1);
			expect(onSelectionChange).toHaveBeenCalledWith(['row-1']);
		});

		it('should call onSelectionChange when row is selected', () => {
			const onSelectionChange = vi.fn();
			const { result } = renderHook(() => useDataTableSelection({ onSelectionChange }));

			act(() => {
				result.current.selectRow('row-1');
			});

			expect(onSelectionChange).toHaveBeenCalledTimes(1);
			expect(onSelectionChange).toHaveBeenCalledWith(['row-1']);
		});

		it('should call onSelectionChange when row is deselected', () => {
			const onSelectionChange = vi.fn();
			const { result } = renderHook(() =>
				useDataTableSelection({
					initialSelectedIds: ['row-1'],
					onSelectionChange,
				})
			);

			act(() => {
				result.current.deselectRow('row-1');
			});

			expect(onSelectionChange).toHaveBeenCalledTimes(1);
			expect(onSelectionChange).toHaveBeenCalledWith([]);
		});

		it('should call onSelectionChange when all rows are selected', () => {
			const onSelectionChange = vi.fn();
			const { result } = renderHook(() => useDataTableSelection({ onSelectionChange }));

			act(() => {
				result.current.selectAll(['row-1', 'row-2']);
			});

			expect(onSelectionChange).toHaveBeenCalledTimes(1);
			expect(onSelectionChange).toHaveBeenCalledWith(['row-1', 'row-2']);
		});

		it('should call onSelectionChange when selection is cleared', () => {
			const onSelectionChange = vi.fn();
			const { result } = renderHook(() =>
				useDataTableSelection({
					initialSelectedIds: ['row-1', 'row-2'],
					onSelectionChange,
				})
			);

			act(() => {
				result.current.clearSelection();
			});

			expect(onSelectionChange).toHaveBeenCalledTimes(1);
			expect(onSelectionChange).toHaveBeenCalledWith([]);
		});

		it('should not call onSelectionChange when not provided', () => {
			const { result } = renderHook(() => useDataTableSelection({}));

			act(() => {
				result.current.toggleRow('row-1');
			});

			// Should not throw
			expect(result.current.isSelected('row-1')).toBe(true);
		});
	});

	describe('selectedCount', () => {
		it('should return correct count after selection', () => {
			const { result } = renderHook(() => useDataTableSelection({}));

			act(() => {
				result.current.selectRow('row-1');
			});

			act(() => {
				result.current.selectRow('row-2');
			});

			expect(result.current.selectedCount).toBe(2);
		});

		it('should return correct count after deselection', () => {
			const { result } = renderHook(() =>
				useDataTableSelection({ initialSelectedIds: ['row-1', 'row-2'] })
			);

			act(() => {
				result.current.deselectRow('row-1');
			});

			expect(result.current.selectedCount).toBe(1);
		});

		it('should return zero when selection is cleared', () => {
			const { result } = renderHook(() =>
				useDataTableSelection({ initialSelectedIds: ['row-1', 'row-2'] })
			);

			act(() => {
				result.current.clearSelection();
			});

			expect(result.current.selectedCount).toBe(0);
		});
	});

	describe('edge cases', () => {
		it('should handle duplicate row IDs in initialSelectedIds', () => {
			const initialSelectedIds = ['row-1', 'row-1', 'row-2'];
			const { result } = renderHook(() => useDataTableSelection({ initialSelectedIds }));

			// Set should deduplicate
			expect(result.current.selectedCount).toBe(2);
			expect(result.current.isSelected('row-1')).toBe(true);
			expect(result.current.isSelected('row-2')).toBe(true);
		});

		it('should handle rapid toggles', () => {
			const { result } = renderHook(() => useDataTableSelection({}));

			act(() => {
				result.current.toggleRow('row-1');
				result.current.toggleRow('row-1');
				result.current.toggleRow('row-1');
			});

			expect(result.current.isSelected('row-1')).toBe(true);
			expect(result.current.selectedCount).toBe(1);
		});

		it('should maintain stable function references', () => {
			const { result, rerender } = renderHook(() => useDataTableSelection({}));

			const { toggleRow, selectRow, deselectRow, selectAll, toggleAll, clearSelection } =
				result.current;

			rerender();

			expect(result.current.toggleRow).toBe(toggleRow);
			expect(result.current.selectRow).toBe(selectRow);
			expect(result.current.deselectRow).toBe(deselectRow);
			expect(result.current.selectAll).toBe(selectAll);
			expect(result.current.toggleAll).toBe(toggleAll);
			expect(result.current.clearSelection).toBe(clearSelection);
		});

		it('should handle special characters in row IDs', () => {
			const { result } = renderHook(() => useDataTableSelection({}));

			act(() => {
				result.current.selectRow('row-1_$#@');
			});

			expect(result.current.isSelected('row-1_$#@')).toBe(true);
		});

		it('should handle empty string row ID', () => {
			const { result } = renderHook(() => useDataTableSelection({}));

			act(() => {
				result.current.selectRow('');
			});

			expect(result.current.isSelected('')).toBe(true);
		});
	});
});
