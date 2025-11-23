/**
 * useMenubar.keyboard Tests
 *
 * Tests for menubar keyboard handler hook:
 * - useKeyDownHandler
 */

import { handleMenubarKeyDown } from '@core/ui/navigation/menubar/helpers/MenubarKeyboard';
import { useKeyDownHandler } from '@core/ui/navigation/menubar/hooks/useMenubar.keyboard';
import type { MenubarItem } from '@src-types/ui/navigation/menubar';
import { renderHook } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

// Mock the keyboard handler
vi.mock('@core/ui/navigation/menubar/helpers/MenubarKeyboard', () => ({
	handleMenubarKeyDown: vi.fn(),
}));

const createTestItems = (): readonly MenubarItem[] => [
	{ id: 'file', label: 'File' },
	{ id: 'edit', label: 'Edit' },
];

describe('useKeyDownHandler', () => {
	it('returns a keyboard event handler', () => {
		const items = createTestItems();
		const itemRefs = new Map();
		for (const item of items) {
			itemRefs.set(item.id, createRef());
		}

		const { result } = renderHook(() =>
			useKeyDownHandler({
				items,
				activeItemId: null,
				openSubmenuId: null,
				setActiveItemId: vi.fn(),
				setOpenSubmenuId: vi.fn(),
				itemRefs,
				handleItemClick: vi.fn(),
			})
		);

		expect(typeof result.current).toBe('function');
	});

	it('calls handleMenubarKeyDown when handler is invoked', () => {
		const items = createTestItems();
		const itemRefs = new Map();
		for (const item of items) {
			itemRefs.set(item.id, createRef());
		}

		const setActiveItemId = vi.fn();
		const setOpenSubmenuId = vi.fn();
		const handleItemClick = vi.fn();

		const { result } = renderHook(() =>
			useKeyDownHandler({
				items,
				activeItemId: 'file',
				openSubmenuId: null,
				setActiveItemId,
				setOpenSubmenuId,
				itemRefs,
				handleItemClick,
			})
		);

		const event = {
			key: 'ArrowRight',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLElement>;

		result.current(event);

		expect(handleMenubarKeyDown).toHaveBeenCalledWith({
			event,
			items,
			activeItemId: 'file',
			openSubmenuId: null,
			setActiveItemId,
			setOpenSubmenuId,
			itemRefs,
			handleItemClick,
		});
	});

	it('returns a new handler when dependencies change', () => {
		const items = createTestItems();
		const itemRefs = new Map();
		for (const item of items) {
			itemRefs.set(item.id, createRef());
		}

		const setActiveItemId = vi.fn();
		const setOpenSubmenuId = vi.fn();
		const handleItemClick = vi.fn();

		const { result, rerender } = renderHook(
			({ activeItemId }: { activeItemId: string | null }) =>
				useKeyDownHandler({
					items,
					activeItemId,
					openSubmenuId: null,
					setActiveItemId,
					setOpenSubmenuId,
					itemRefs,
					handleItemClick,
				}),
			{ initialProps: { activeItemId: null as string | null } }
		);

		const firstHandler = result.current;

		// Handler should be a function
		expect(typeof firstHandler).toBe('function');

		// Handler should change when activeItemId changes
		rerender({ activeItemId: 'file' });
		expect(result.current).not.toBe(firstHandler);
		expect(typeof result.current).toBe('function');
	});
});
