import {
	findNextEnabledItemIndex,
	getMenuContainerProps,
} from '@core/ui/navigation/navigation-menu/helpers/navigationMenuUtils';
import type { NavigationMenuItem } from '@src-types/ui/navigation/navigationMenu';
import type { KeyboardEvent } from 'react';
import { describe, expect, it } from 'vitest';

describe('navigationMenuUtils', () => {
	describe('findNextEnabledItemIndex', () => {
		it('finds next enabled item in forward direction', () => {
			const items: readonly NavigationMenuItem[] = [
				{ id: '1', label: 'Item 1' },
				{ id: '2', label: 'Item 2', disabled: true },
				{ id: '3', label: 'Item 3' },
			];

			const result = findNextEnabledItemIndex(items, 0, 1);
			expect(result).toBe(2);
		});

		it('finds next enabled item in backward direction', () => {
			const items: readonly NavigationMenuItem[] = [
				{ id: '1', label: 'Item 1' },
				{ id: '2', label: 'Item 2', disabled: true },
				{ id: '3', label: 'Item 3' },
			];

			const result = findNextEnabledItemIndex(items, 2, -1);
			expect(result).toBe(0);
		});

		it('wraps around to find enabled item in forward direction', () => {
			const items: readonly NavigationMenuItem[] = [
				{ id: '1', label: 'Item 1' },
				{ id: '2', label: 'Item 2', disabled: true },
				{ id: '3', label: 'Item 3' },
			];

			const result = findNextEnabledItemIndex(items, 2, 1);
			expect(result).toBe(0);
		});

		it('wraps around to find enabled item in backward direction', () => {
			const items: readonly NavigationMenuItem[] = [
				{ id: '1', label: 'Item 1' },
				{ id: '2', label: 'Item 2', disabled: true },
				{ id: '3', label: 'Item 3' },
			];

			const result = findNextEnabledItemIndex(items, 0, -1);
			expect(result).toBe(2);
		});

		it('skips multiple disabled items in forward direction', () => {
			const items: readonly NavigationMenuItem[] = [
				{ id: '1', label: 'Item 1' },
				{ id: '2', label: 'Item 2', disabled: true },
				{ id: '3', label: 'Item 3', disabled: true },
				{ id: '4', label: 'Item 4' },
			];

			const result = findNextEnabledItemIndex(items, 0, 1);
			expect(result).toBe(3);
		});

		it('skips multiple disabled items in backward direction', () => {
			const items: readonly NavigationMenuItem[] = [
				{ id: '1', label: 'Item 1' },
				{ id: '2', label: 'Item 2', disabled: true },
				{ id: '3', label: 'Item 3', disabled: true },
				{ id: '4', label: 'Item 4' },
			];

			const result = findNextEnabledItemIndex(items, 3, -1);
			expect(result).toBe(0);
		});

		it('returns -1 when all items are disabled', () => {
			const items: readonly NavigationMenuItem[] = [
				{ id: '1', label: 'Item 1', disabled: true },
				{ id: '2', label: 'Item 2', disabled: true },
				{ id: '3', label: 'Item 3', disabled: true },
			];

			const result = findNextEnabledItemIndex(items, 0, 1);
			expect(result).toBe(-1);
		});

		it('handles single enabled item', () => {
			const items: readonly NavigationMenuItem[] = [
				{ id: '1', label: 'Item 1' },
				{ id: '2', label: 'Item 2', disabled: true },
			];

			const result = findNextEnabledItemIndex(items, 0, 1);
			expect(result).toBe(0);
		});

		it('handles empty array', () => {
			const items: readonly NavigationMenuItem[] = [];
			const result = findNextEnabledItemIndex(items, 0, 1);
			expect(result).toBe(-1);
		});

		it('handles startIndex at beginning with forward direction', () => {
			const items: readonly NavigationMenuItem[] = [
				{ id: '1', label: 'Item 1' },
				{ id: '2', label: 'Item 2' },
			];

			const result = findNextEnabledItemIndex(items, 0, 1);
			expect(result).toBe(1);
		});

		it('handles startIndex at end with backward direction', () => {
			const items: readonly NavigationMenuItem[] = [
				{ id: '1', label: 'Item 1' },
				{ id: '2', label: 'Item 2' },
			];

			const result = findNextEnabledItemIndex(items, 1, -1);
			expect(result).toBe(0);
		});

		it('handles startIndex out of bounds (negative) for forward direction', () => {
			const items: readonly NavigationMenuItem[] = [
				{ id: '1', label: 'Item 1' },
				{ id: '2', label: 'Item 2' },
			];

			const result = findNextEnabledItemIndex(items, -1, 1);
			expect(result).toBe(0);
		});

		it('handles startIndex out of bounds (beyond length) for backward direction', () => {
			const items: readonly NavigationMenuItem[] = [
				{ id: '1', label: 'Item 1' },
				{ id: '2', label: 'Item 2' },
			];

			const result = findNextEnabledItemIndex(items, 10, -1);
			expect(result).toBe(1);
		});
	});

	describe('getMenuContainerProps', () => {
		it('returns correct props for horizontal orientation', () => {
			const classes = 'test-class';
			const handleKeyDown = vi.fn((event: KeyboardEvent<HTMLElement>) => {
				event.preventDefault();
			});

			const props = getMenuContainerProps('horizontal', classes, handleKeyDown);

			expect(props).toEqual({
				role: 'menu',
				className: classes,
				onKeyDown: handleKeyDown,
				tabIndex: 0,
				'aria-orientation': 'horizontal',
			});
		});

		it('returns correct props for vertical orientation', () => {
			const classes = 'test-class';
			const handleKeyDown = vi.fn((event: KeyboardEvent<HTMLElement>) => {
				event.preventDefault();
			});

			const props = getMenuContainerProps('vertical', classes, handleKeyDown);

			expect(props).toEqual({
				role: 'menu',
				className: classes,
				onKeyDown: handleKeyDown,
				tabIndex: 0,
				'aria-orientation': 'vertical',
			});
		});

		it('preserves custom className', () => {
			const classes = 'custom-class another-class';
			const handleKeyDown = vi.fn();

			const props = getMenuContainerProps('horizontal', classes, handleKeyDown);

			expect(props.className).toBe(classes);
		});

		it('binds handleKeyDown correctly', () => {
			const handleKeyDown = vi.fn();
			const props = getMenuContainerProps('horizontal', '', handleKeyDown);

			expect(props.onKeyDown).toBe(handleKeyDown);
		});
	});
});
