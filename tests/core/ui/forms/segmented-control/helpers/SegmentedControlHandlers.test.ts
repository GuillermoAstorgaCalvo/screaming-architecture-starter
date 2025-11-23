/**
 * SegmentedControlHandlers Tests
 *
 * Tests for SegmentedControl keyboard handler functions:
 * - handlePreviousItem
 * - handleNextItem
 * - handleFirstItem
 * - handleLastItem
 * - handleKeyDown
 */

import {
	handleFirstItem,
	handleKeyDown,
	handleLastItem,
	handleNextItem,
	handlePreviousItem,
} from '@core/ui/forms/segmented-control/helpers/SegmentedControlHandlers';
import type { SegmentedControlItem } from '@src-types/ui/navigation/segmentedControl';
import { describe, expect, it, vi } from 'vitest';

const createItems = (count: number, disabledIndices: number[] = []): SegmentedControlItem[] => {
	return Array.from({ length: count }, (_, i) => ({
		id: `item-${i}`,
		label: `Item ${i}`,
		disabled: disabledIndices.includes(i),
	}));
};

describe('handlePreviousItem', () => {
	it('moves to previous item', () => {
		const items = createItems(3);
		const onValueChange = vi.fn();

		handlePreviousItem({
			items,
			itemIndex: 1,
			onValueChange,
		});

		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(onValueChange).toHaveBeenCalledWith('item-0');
	});

	it('wraps to last item when at first item', () => {
		const items = createItems(3);
		const onValueChange = vi.fn();

		handlePreviousItem({
			items,
			itemIndex: 0,
			onValueChange,
		});

		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(onValueChange).toHaveBeenCalledWith('item-2');
	});

	it('does not call onValueChange when previous item is disabled', () => {
		const items = createItems(3, [1]);
		const onValueChange = vi.fn();

		handlePreviousItem({
			items,
			itemIndex: 2,
			onValueChange,
		});

		expect(onValueChange).not.toHaveBeenCalled();
	});

	it('handles single item', () => {
		const items = createItems(1);
		const onValueChange = vi.fn();

		handlePreviousItem({
			items,
			itemIndex: 0,
			onValueChange,
		});

		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(onValueChange).toHaveBeenCalledWith('item-0');
	});
});

describe('handleNextItem', () => {
	it('moves to next item', () => {
		const items = createItems(3);
		const onValueChange = vi.fn();

		handleNextItem({
			items,
			itemIndex: 0,
			onValueChange,
		});

		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(onValueChange).toHaveBeenCalledWith('item-1');
	});

	it('wraps to first item when at last item', () => {
		const items = createItems(3);
		const onValueChange = vi.fn();

		handleNextItem({
			items,
			itemIndex: 2,
			onValueChange,
		});

		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(onValueChange).toHaveBeenCalledWith('item-0');
	});

	it('does not call onValueChange when next item is disabled', () => {
		const items = createItems(3, [1]);
		const onValueChange = vi.fn();

		handleNextItem({
			items,
			itemIndex: 0,
			onValueChange,
		});

		expect(onValueChange).not.toHaveBeenCalled();
	});

	it('handles single item', () => {
		const items = createItems(1);
		const onValueChange = vi.fn();

		handleNextItem({
			items,
			itemIndex: 0,
			onValueChange,
		});

		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(onValueChange).toHaveBeenCalledWith('item-0');
	});
});

describe('handleFirstItem', () => {
	it('moves to first item', () => {
		const items = createItems(3);
		const onValueChange = vi.fn();

		handleFirstItem({
			items,
			onValueChange,
		});

		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(onValueChange).toHaveBeenCalledWith('item-0');
	});

	it('skips disabled first item', () => {
		const items = createItems(3, [0]);
		const onValueChange = vi.fn();

		handleFirstItem({
			items,
			onValueChange,
		});

		// Should not call onValueChange if first item is disabled
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it('handles empty items array', () => {
		const items: SegmentedControlItem[] = [];
		const onValueChange = vi.fn();

		handleFirstItem({
			items,
			onValueChange,
		});

		expect(onValueChange).not.toHaveBeenCalled();
	});

	it('handles single item', () => {
		const items = createItems(1);
		const onValueChange = vi.fn();

		handleFirstItem({
			items,
			onValueChange,
		});

		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(onValueChange).toHaveBeenCalledWith('item-0');
	});
});

describe('handleLastItem', () => {
	it('moves to last item', () => {
		const items = createItems(3);
		const onValueChange = vi.fn();

		handleLastItem({
			items,
			onValueChange,
		});

		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(onValueChange).toHaveBeenCalledWith('item-2');
	});

	it('skips disabled last item', () => {
		const items = createItems(3, [2]);
		const onValueChange = vi.fn();

		handleLastItem({
			items,
			onValueChange,
		});

		// Should not call onValueChange if last item is disabled
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it('handles empty items array', () => {
		const items: SegmentedControlItem[] = [];
		const onValueChange = vi.fn();

		handleLastItem({
			items,
			onValueChange,
		});

		expect(onValueChange).not.toHaveBeenCalled();
	});

	it('handles single item', () => {
		const items = createItems(1);
		const onValueChange = vi.fn();

		handleLastItem({
			items,
			onValueChange,
		});

		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(onValueChange).toHaveBeenCalledWith('item-0');
	});
});

describe('handleKeyDown', () => {
	const createMockEvent = (key: string): React.KeyboardEvent<HTMLButtonElement> => {
		return {
			key,
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLButtonElement>;
	};

	it('handles ArrowLeft key', () => {
		const items = createItems(3);
		const onValueChange = vi.fn();
		const event = createMockEvent('ArrowLeft');

		handleKeyDown({
			event,
			itemId: 'item-1',
			items,
			disabled: false,
			onValueChange,
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(onValueChange).toHaveBeenCalledWith('item-0');
	});

	it('handles ArrowUp key', () => {
		const items = createItems(3);
		const onValueChange = vi.fn();
		const event = createMockEvent('ArrowUp');

		handleKeyDown({
			event,
			itemId: 'item-1',
			items,
			disabled: false,
			onValueChange,
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(onValueChange).toHaveBeenCalledWith('item-0');
	});

	it('handles ArrowRight key', () => {
		const items = createItems(3);
		const onValueChange = vi.fn();
		const event = createMockEvent('ArrowRight');

		handleKeyDown({
			event,
			itemId: 'item-1',
			items,
			disabled: false,
			onValueChange,
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(onValueChange).toHaveBeenCalledWith('item-2');
	});

	it('handles ArrowDown key', () => {
		const items = createItems(3);
		const onValueChange = vi.fn();
		const event = createMockEvent('ArrowDown');

		handleKeyDown({
			event,
			itemId: 'item-1',
			items,
			disabled: false,
			onValueChange,
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(onValueChange).toHaveBeenCalledWith('item-2');
	});

	it('handles Home key', () => {
		const items = createItems(3);
		const onValueChange = vi.fn();
		const event = createMockEvent('Home');

		handleKeyDown({
			event,
			itemId: 'item-2',
			items,
			disabled: false,
			onValueChange,
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(onValueChange).toHaveBeenCalledWith('item-0');
	});

	it('handles End key', () => {
		const items = createItems(3);
		const onValueChange = vi.fn();
		const event = createMockEvent('End');

		handleKeyDown({
			event,
			itemId: 'item-0',
			items,
			disabled: false,
			onValueChange,
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(onValueChange).toHaveBeenCalledWith('item-2');
	});

	it('does nothing when disabled is true', () => {
		const items = createItems(3);
		const onValueChange = vi.fn();
		const event = createMockEvent('ArrowRight');

		handleKeyDown({
			event,
			itemId: 'item-1',
			items,
			disabled: true,
			onValueChange,
		});

		expect(event.preventDefault).not.toHaveBeenCalled();
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it('does nothing for unhandled keys', () => {
		const items = createItems(3);
		const onValueChange = vi.fn();
		const event = createMockEvent('Enter');

		handleKeyDown({
			event,
			itemId: 'item-1',
			items,
			disabled: false,
			onValueChange,
		});

		expect(event.preventDefault).not.toHaveBeenCalled();
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it('handles item not found in items array', () => {
		const items = createItems(3);
		const onValueChange = vi.fn();
		const event = createMockEvent('ArrowRight');

		handleKeyDown({
			event,
			itemId: 'non-existent',
			items,
			disabled: false,
			onValueChange,
		});

		// Should not throw, but may not call onValueChange
		expect(event.preventDefault).toHaveBeenCalled();
	});

	it('wraps navigation correctly', () => {
		const items = createItems(3);
		const onValueChange = vi.fn();

		// Test wrapping from last to first
		const event1 = createMockEvent('ArrowRight');
		handleKeyDown({
			event: event1,
			itemId: 'item-2',
			items,
			disabled: false,
			onValueChange,
		});

		expect(onValueChange).toHaveBeenCalledWith('item-0');

		// Test wrapping from first to last
		const event2 = createMockEvent('ArrowLeft');
		handleKeyDown({
			event: event2,
			itemId: 'item-0',
			items,
			disabled: false,
			onValueChange,
		});

		expect(onValueChange).toHaveBeenCalledWith('item-2');
	});
});
