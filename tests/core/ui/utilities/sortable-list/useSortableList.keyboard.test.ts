/**
 * Tests for useSortableList.keyboard hook
 *
 * Tests keyboard handlers:
 * - ArrowUp key
 * - ArrowDown key
 * - Home key
 * - End key
 * - Disabled state
 * - Edge cases
 */

import { useKeyboardHandlers } from '@core/ui/utilities/sortable-list/hooks/useSortableList.keyboard';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

interface TestItem {
	id: string;
	data: string;
}

const mockItems: TestItem[] = [
	{ id: '1', data: 'Item 1' },
	{ id: '2', data: 'Item 2' },
	{ id: '3', data: 'Item 3' },
];

function createKeyboardEvent(key: string) {
	return new KeyboardEvent('keydown', {
		key,
		bubbles: true,
		cancelable: true,
	}) as any;
}

function setupHook(disabled = false) {
	const onReorder = vi.fn();
	const { result } = renderHook(() =>
		useKeyboardHandlers({
			items: mockItems,
			onReorder,
			disabled,
		})
	);
	return { result, onReorder };
}

async function expectReorder(
	onReorder: ReturnType<typeof vi.fn>,
	expectedFirstId: string,
	expectedSecondId?: string
) {
	await waitFor(() => {
		expect(onReorder).toHaveBeenCalled();
	});

	const reorderedItems = onReorder.mock.calls[0]?.[0];
	expect(reorderedItems[0].id).toBe(expectedFirstId);
	if (expectedSecondId) {
		expect(reorderedItems[1].id).toBe(expectedSecondId);
	}
}

describe('useKeyboardHandlers - ArrowUp', () => {
	it('moves item up when ArrowUp is pressed', async () => {
		const { result, onReorder } = setupHook();
		const keyEvent = createKeyboardEvent('ArrowUp');

		result.current(keyEvent, '2', 1);

		await expectReorder(onReorder, '2', '1');
	});

	it('does not move when at first position', () => {
		const { result, onReorder } = setupHook();
		const keyEvent = createKeyboardEvent('ArrowUp');

		result.current(keyEvent, '1', 0);

		expect(onReorder).not.toHaveBeenCalled();
	});

	it('prevents default and stops propagation', () => {
		const { result } = setupHook();
		const keyEvent = createKeyboardEvent('ArrowUp');

		const preventDefaultSpy = vi.spyOn(keyEvent, 'preventDefault');
		const stopPropagationSpy = vi.spyOn(keyEvent, 'stopPropagation');

		result.current(keyEvent, '2', 1);

		expect(preventDefaultSpy).toHaveBeenCalled();
		expect(stopPropagationSpy).toHaveBeenCalled();
	});
});

describe('useKeyboardHandlers - ArrowDown', () => {
	it('moves item down when ArrowDown is pressed', async () => {
		const { result, onReorder } = setupHook();
		const keyEvent = createKeyboardEvent('ArrowDown');

		result.current(keyEvent, '1', 0);

		await expectReorder(onReorder, '2', '1');
	});

	it('does not move when at last position', () => {
		const { result, onReorder } = setupHook();
		const keyEvent = createKeyboardEvent('ArrowDown');

		result.current(keyEvent, '3', 2);

		expect(onReorder).not.toHaveBeenCalled();
	});
});

describe('useKeyboardHandlers - Home', () => {
	it('moves item to start when Home is pressed', async () => {
		const { result, onReorder } = setupHook();
		const keyEvent = createKeyboardEvent('Home');

		result.current(keyEvent, '3', 2);

		await expectReorder(onReorder, '3');
	});

	it('does not move when already at start', () => {
		const { result, onReorder } = setupHook();
		const keyEvent = createKeyboardEvent('Home');

		result.current(keyEvent, '1', 0);

		expect(onReorder).not.toHaveBeenCalled();
	});
});

describe('useKeyboardHandlers - End', () => {
	it('moves item to end when End is pressed', async () => {
		const { result, onReorder } = setupHook();
		const keyEvent = createKeyboardEvent('End');

		result.current(keyEvent, '1', 0);

		await waitFor(() => {
			expect(onReorder).toHaveBeenCalled();
		});

		const reorderedItems = onReorder.mock.calls[0]?.[0];
		expect(reorderedItems[2].id).toBe('1');
	});

	it('does not move when already at end', () => {
		const { result, onReorder } = setupHook();
		const keyEvent = createKeyboardEvent('End');

		result.current(keyEvent, '3', 2);

		expect(onReorder).not.toHaveBeenCalled();
	});
});

describe('useKeyboardHandlers - Disabled State', () => {
	it('does not handle keys when disabled', () => {
		const { result, onReorder } = setupHook(true);
		const keyEvent = createKeyboardEvent('ArrowDown');

		result.current(keyEvent, '1', 0);

		expect(onReorder).not.toHaveBeenCalled();
	});
});

describe('useKeyboardHandlers - Other Keys', () => {
	it('does not handle other keys', () => {
		const { result, onReorder } = setupHook();
		const keyEvent = createKeyboardEvent('Enter');

		result.current(keyEvent, '1', 0);

		expect(onReorder).not.toHaveBeenCalled();
	});
});
