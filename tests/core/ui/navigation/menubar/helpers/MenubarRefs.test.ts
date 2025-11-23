/**
 * MenubarRefs Tests
 *
 * Tests for menubar ref creation:
 * - createItemRefs
 */

import { createItemRefs } from '@core/ui/navigation/menubar/helpers/MenubarRefs';
import type { MenubarItem } from '@src-types/ui/navigation/menubar';
import { describe, expect, it } from 'vitest';

describe('createItemRefs', () => {
	it('creates refs for all items', () => {
		const items: readonly MenubarItem[] = [
			{ id: 'item1', label: 'Item 1' },
			{ id: 'item2', label: 'Item 2' },
			{ id: 'item3', label: 'Item 3' },
		];

		const refs = createItemRefs(items);

		expect(refs.size).toBe(3);
		expect(refs.has('item1')).toBe(true);
		expect(refs.has('item2')).toBe(true);
		expect(refs.has('item3')).toBe(true);
	});

	it('creates refs with correct type', () => {
		const items: readonly MenubarItem[] = [{ id: 'item1', label: 'Item 1' }];

		const refs = createItemRefs(items);
		const ref = refs.get('item1');

		expect(ref).toBeDefined();
		expect(ref?.current).toBeNull(); // Initially null before mounting
	});

	it('handles empty items array', () => {
		const items: readonly MenubarItem[] = [];

		const refs = createItemRefs(items);

		expect(refs.size).toBe(0);
	});

	it('creates unique refs for each item', () => {
		const items: readonly MenubarItem[] = [
			{ id: 'item1', label: 'Item 1' },
			{ id: 'item2', label: 'Item 2' },
		];

		const refs = createItemRefs(items);
		const ref1 = refs.get('item1');
		const ref2 = refs.get('item2');

		expect(ref1).not.toBe(ref2);
		expect(ref1).toBeDefined();
		expect(ref2).toBeDefined();
	});

	it('handles items with submenus', () => {
		const items: readonly MenubarItem[] = [
			{
				id: 'item1',
				label: 'Item 1',
				submenu: [{ id: 'sub1', label: 'Sub 1' }],
			},
		];

		const refs = createItemRefs(items);

		expect(refs.size).toBe(1);
		expect(refs.has('item1')).toBe(true);
	});
});
