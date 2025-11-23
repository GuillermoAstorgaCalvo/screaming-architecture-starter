/**
 * Tests for useSortableList.drag.logic
 *
 * Tests drag logic functions:
 * - resetDragState
 * - isValidDragOperation
 * - createDragStartLogic
 * - createDragOverLogic
 * - createDropLogic
 */

import {
	createDragOverLogic,
	createDragStartLogic,
	createDropLogic,
	isValidDragOperation,
	resetDragState,
} from '@core/ui/utilities/sortable-list/helpers/useSortableList.drag.logic';
import { describe, expect, it, vi } from 'vitest';

describe('resetDragState', () => {
	it('resets all drag state', () => {
		const setDraggedItemId = vi.fn();
		const setDragTargetIndex = vi.fn();
		const draggedIndexRef = { current: 1 };

		resetDragState(setDraggedItemId, setDragTargetIndex, draggedIndexRef);

		expect(setDraggedItemId).toHaveBeenCalledWith(null);
		expect(setDragTargetIndex).toHaveBeenCalledWith(null);
		expect(draggedIndexRef.current).toBeNull();
	});
});

describe('isValidDragOperation', () => {
	it('returns true for valid drag operation', () => {
		const isValid = isValidDragOperation(false, 'item-1', 0);

		expect(isValid).toBe(true);
	});

	it('returns false when disabled', () => {
		const isValid = isValidDragOperation(true, 'item-1', 0);

		expect(isValid).toBe(false);
	});

	it('returns false when draggedItemId is null', () => {
		const isValid = isValidDragOperation(false, null, 0);

		expect(isValid).toBe(false);
	});

	it('returns false when draggedIndex is null', () => {
		const isValid = isValidDragOperation(false, 'item-1', null);

		expect(isValid).toBe(false);
	});

	it('returns false when all conditions are invalid', () => {
		const isValid = isValidDragOperation(true, null, null);

		expect(isValid).toBe(false);
	});
});

describe('createDragStartLogic', () => {
	it('sets dragged item ID and index when not disabled', () => {
		const setDraggedItemId = vi.fn();
		const draggedIndexRef = { current: null };

		createDragStartLogic({
			disabled: false,
			setDraggedItemId,
			draggedIndexRef,
			itemId: 'item-1',
			index: 2,
		});

		expect(setDraggedItemId).toHaveBeenCalledWith('item-1');
		expect(draggedIndexRef.current).toBe(2);
	});

	it('does not set state when disabled', () => {
		const setDraggedItemId = vi.fn();
		const draggedIndexRef = { current: null };

		createDragStartLogic({
			disabled: true,
			setDraggedItemId,
			draggedIndexRef,
			itemId: 'item-1',
			index: 2,
		});

		expect(setDraggedItemId).not.toHaveBeenCalled();
		expect(draggedIndexRef.current).toBeNull();
	});
});

describe('createDragOverLogic - valid operations', () => {
	it('sets drag target index when valid and different from dragged index', () => {
		const setDragTargetIndex = vi.fn();

		createDragOverLogic({
			disabled: false,
			draggedItemId: 'item-1',
			draggedIndex: 0,
			setDragTargetIndex,
			index: 2,
		});

		expect(setDragTargetIndex).toHaveBeenCalledWith(2);
	});

	it('clears drag target index when same as dragged index', () => {
		const setDragTargetIndex = vi.fn();

		createDragOverLogic({
			disabled: false,
			draggedItemId: 'item-1',
			draggedIndex: 1,
			setDragTargetIndex,
			index: 1,
		});

		expect(setDragTargetIndex).toHaveBeenCalledWith(null);
	});
});

describe('createDragOverLogic - invalid operations', () => {
	it('does not set state when disabled', () => {
		const setDragTargetIndex = vi.fn();

		createDragOverLogic({
			disabled: true,
			draggedItemId: 'item-1',
			draggedIndex: 0,
			setDragTargetIndex,
			index: 2,
		});

		expect(setDragTargetIndex).not.toHaveBeenCalled();
	});

	it('does not set state when draggedItemId is null', () => {
		const setDragTargetIndex = vi.fn();

		createDragOverLogic({
			disabled: false,
			draggedItemId: null,
			draggedIndex: 0,
			setDragTargetIndex,
			index: 2,
		});

		expect(setDragTargetIndex).not.toHaveBeenCalled();
	});

	it('does not set state when draggedIndex is null', () => {
		const setDragTargetIndex = vi.fn();

		createDragOverLogic({
			disabled: false,
			draggedItemId: 'item-1',
			draggedIndex: null,
			setDragTargetIndex,
			index: 2,
		});

		expect(setDragTargetIndex).not.toHaveBeenCalled();
	});
});

describe('createDropLogic - forward reordering', () => {
	it('reorders items forward and resets state', () => {
		const items = [
			{ id: '1', data: 'Item 1' },
			{ id: '2', data: 'Item 2' },
			{ id: '3', data: 'Item 3' },
		];
		const onReorder = vi.fn();
		const resetState = vi.fn();

		createDropLogic({
			disabled: false,
			draggedItemId: '1',
			draggedIndex: 0,
			items,
			onReorder,
			targetIndex: 2,
			resetState,
		});

		expect(onReorder).toHaveBeenCalledWith([
			{ id: '2', data: 'Item 2' },
			{ id: '3', data: 'Item 3' },
			{ id: '1', data: 'Item 1' },
		]);
		expect(resetState).toHaveBeenCalled();
	});
});

describe('createDropLogic - backward reordering', () => {
	it('reorders items backward and resets state', () => {
		const items = [
			{ id: '1', data: 'Item 1' },
			{ id: '2', data: 'Item 2' },
			{ id: '3', data: 'Item 3' },
		];
		const onReorder = vi.fn();
		const resetState = vi.fn();

		createDropLogic({
			disabled: false,
			draggedItemId: '3',
			draggedIndex: 2,
			items,
			onReorder,
			targetIndex: 0,
			resetState,
		});

		expect(onReorder).toHaveBeenCalledWith([
			{ id: '3', data: 'Item 3' },
			{ id: '1', data: 'Item 1' },
			{ id: '2', data: 'Item 2' },
		]);
		expect(resetState).toHaveBeenCalled();
	});
});

describe('createDropLogic - same index', () => {
	it('does not reorder when draggedIndex equals targetIndex', () => {
		const items = [
			{ id: '1', data: 'Item 1' },
			{ id: '2', data: 'Item 2' },
		];
		const onReorder = vi.fn();
		const resetState = vi.fn();

		createDropLogic({
			disabled: false,
			draggedItemId: '1',
			draggedIndex: 1,
			items,
			onReorder,
			targetIndex: 1,
			resetState,
		});

		expect(onReorder).not.toHaveBeenCalled();
		expect(resetState).toHaveBeenCalled();
	});
});

describe('createDropLogic - disabled state', () => {
	it('does not reorder when disabled', () => {
		const items = [
			{ id: '1', data: 'Item 1' },
			{ id: '2', data: 'Item 2' },
		];
		const onReorder = vi.fn();
		const resetState = vi.fn();

		createDropLogic({
			disabled: true,
			draggedItemId: '1',
			draggedIndex: 0,
			items,
			onReorder,
			targetIndex: 1,
			resetState,
		});

		expect(onReorder).not.toHaveBeenCalled();
		expect(resetState).not.toHaveBeenCalled();
	});
});

describe('createDropLogic - null draggedItemId', () => {
	it('does not reorder when draggedItemId is null', () => {
		const items = [
			{ id: '1', data: 'Item 1' },
			{ id: '2', data: 'Item 2' },
		];
		const onReorder = vi.fn();
		const resetState = vi.fn();

		createDropLogic({
			disabled: false,
			draggedItemId: null,
			draggedIndex: 0,
			items,
			onReorder,
			targetIndex: 1,
			resetState,
		});

		expect(onReorder).not.toHaveBeenCalled();
		expect(resetState).not.toHaveBeenCalled();
	});
});

describe('createDropLogic - null draggedIndex', () => {
	it('does not reorder when draggedIndex is null', () => {
		const items = [
			{ id: '1', data: 'Item 1' },
			{ id: '2', data: 'Item 2' },
		];
		const onReorder = vi.fn();
		const resetState = vi.fn();

		createDropLogic({
			disabled: false,
			draggedItemId: '1',
			draggedIndex: null,
			items,
			onReorder,
			targetIndex: 1,
			resetState,
		});

		expect(onReorder).not.toHaveBeenCalled();
		expect(resetState).not.toHaveBeenCalled();
	});
});
