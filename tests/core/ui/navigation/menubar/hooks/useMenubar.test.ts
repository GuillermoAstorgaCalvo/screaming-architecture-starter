/**
 * useMenubar Tests
 *
 * Tests for main menubar hook:
 * - Hook composition
 * - Handler integration
 */

import { useMenubar } from '@core/ui/navigation/menubar/hooks/useMenubar';
import type { MenubarItem } from '@src-types/ui/navigation/menubar';
import { renderHook } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

const createTestItems = (): readonly MenubarItem[] => [
	{ id: 'file', label: 'File' },
	{ id: 'edit', label: 'Edit' },
];

describe('useMenubar', () => {
	it('returns all required handlers', () => {
		const items = createTestItems();
		const itemRefs = new Map();
		for (const item of items) {
			itemRefs.set(item.id, createRef());
		}

		const { result } = renderHook(() =>
			useMenubar({
				items,
				activeItemId: null,
				setActiveItemId: () => {},
				openSubmenuId: null,
				setOpenSubmenuId: () => {},
				itemRefs,
			})
		);

		expect(result.current).toHaveProperty('handleKeyDown');
		expect(result.current).toHaveProperty('handleItemClick');
		expect(result.current).toHaveProperty('handleSubmenuClose');
		expect(typeof result.current.handleKeyDown).toBe('function');
		expect(typeof result.current.handleItemClick).toBe('function');
		expect(typeof result.current.handleSubmenuClose).toBe('function');
	});

	it('provides handleKeyDown function', () => {
		const items = createTestItems();
		const itemRefs = new Map();
		for (const item of items) {
			itemRefs.set(item.id, createRef());
		}

		const { result } = renderHook(() =>
			useMenubar({
				items,
				activeItemId: null,
				setActiveItemId: () => {},
				openSubmenuId: null,
				setOpenSubmenuId: () => {},
				itemRefs,
			})
		);

		expect(result.current.handleKeyDown).toBeDefined();
		expect(typeof result.current.handleKeyDown).toBe('function');
	});

	it('provides handleItemClick function', () => {
		const items = createTestItems();
		const itemRefs = new Map();
		for (const item of items) {
			itemRefs.set(item.id, createRef());
		}

		const { result } = renderHook(() =>
			useMenubar({
				items,
				activeItemId: null,
				setActiveItemId: () => {},
				openSubmenuId: null,
				setOpenSubmenuId: () => {},
				itemRefs,
			})
		);

		expect(result.current.handleItemClick).toBeDefined();
		expect(typeof result.current.handleItemClick).toBe('function');
	});

	it('provides handleSubmenuClose function', () => {
		const items = createTestItems();
		const itemRefs = new Map();
		for (const item of items) {
			itemRefs.set(item.id, createRef());
		}

		const { result } = renderHook(() =>
			useMenubar({
				items,
				activeItemId: null,
				setActiveItemId: () => {},
				openSubmenuId: null,
				setOpenSubmenuId: () => {},
				itemRefs,
			})
		);

		expect(result.current.handleSubmenuClose).toBeDefined();
		expect(typeof result.current.handleSubmenuClose).toBe('function');
	});
});
