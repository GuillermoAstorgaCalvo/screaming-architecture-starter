import {
	BOTTOM_NAV_ITEM_ACTIVE_CLASSES,
	BOTTOM_NAV_ITEM_BASE_CLASSES,
	BOTTOM_NAV_ITEM_INACTIVE_CLASSES,
	BOTTOM_NAV_ITEM_SIZE_CLASSES,
} from '@core/ui/navigation/bottom-navigation/constants/bottomNavigation.constants';
import {
	getItemClasses,
	handleItemClick,
} from '@core/ui/navigation/bottom-navigation/utils/bottomNavigation.utils';
import type { BottomNavigationItem } from '@src-types/ui/navigation/bottomNavigation';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('bottomNavigation.utils - handleItemClick', () => {
	it('calls onItemChange with item id when item is not disabled', () => {
		const onItemChange = vi.fn();
		const item: BottomNavigationItem = {
			id: 'home',
			label: 'Home',
			icon: null as unknown as React.ReactNode,
		};

		handleItemClick(item, onItemChange);

		expect(onItemChange).toHaveBeenCalledWith('home');
		expect(onItemChange).toHaveBeenCalledTimes(1);
	});

	it('does not call onItemChange when item is disabled', () => {
		const onItemChange = vi.fn();
		const item: BottomNavigationItem = {
			id: 'disabled',
			label: 'Disabled',
			icon: null as unknown as React.ReactNode,
			disabled: true,
		};

		handleItemClick(item, onItemChange);

		expect(onItemChange).not.toHaveBeenCalled();
	});

	it('handles item with undefined disabled property', () => {
		const onItemChange = vi.fn();
		const item: BottomNavigationItem = {
			id: 'home',
			label: 'Home',
			icon: null as unknown as React.ReactNode,
		};

		handleItemClick(item, onItemChange);

		expect(onItemChange).toHaveBeenCalledWith('home');
		expect(onItemChange).toHaveBeenCalledTimes(1);
	});

	it('handles item with disabled set to false', () => {
		const onItemChange = vi.fn();
		const item: BottomNavigationItem = {
			id: 'home',
			label: 'Home',
			icon: null as unknown as React.ReactNode,
			disabled: false,
		};

		handleItemClick(item, onItemChange);

		expect(onItemChange).toHaveBeenCalledWith('home');
		expect(onItemChange).toHaveBeenCalledTimes(1);
	});
});

describe('bottomNavigation.utils - getItemClasses', () => {
	it('returns base classes with active classes when isActive is true', () => {
		const classes = getItemClasses(true, 'md');

		expect(classes).toContain(BOTTOM_NAV_ITEM_BASE_CLASSES);
		expect(classes).toContain(BOTTOM_NAV_ITEM_ACTIVE_CLASSES);
		expect(classes).not.toContain(BOTTOM_NAV_ITEM_INACTIVE_CLASSES);
	});

	it('returns base classes with inactive classes when isActive is false', () => {
		const classes = getItemClasses(false, 'md');

		expect(classes).toContain(BOTTOM_NAV_ITEM_BASE_CLASSES);
		expect(classes).toContain(BOTTOM_NAV_ITEM_INACTIVE_CLASSES);
		expect(classes).not.toContain(BOTTOM_NAV_ITEM_ACTIVE_CLASSES);
	});

	it('includes size classes for small size', () => {
		const classes = getItemClasses(false, 'sm');

		expect(classes).toContain(BOTTOM_NAV_ITEM_SIZE_CLASSES.sm);
	});

	it('includes size classes for medium size', () => {
		const classes = getItemClasses(false, 'md');

		expect(classes).toContain(BOTTOM_NAV_ITEM_SIZE_CLASSES.md);
	});

	it('includes size classes for large size', () => {
		const classes = getItemClasses(false, 'lg');

		expect(classes).toContain(BOTTOM_NAV_ITEM_SIZE_CLASSES.lg);
	});

	it('combines all classes correctly for active medium item', () => {
		const classes = getItemClasses(true, 'md');

		expect(classes).toContain(BOTTOM_NAV_ITEM_BASE_CLASSES);
		expect(classes).toContain(BOTTOM_NAV_ITEM_ACTIVE_CLASSES);
		expect(classes).toContain(BOTTOM_NAV_ITEM_SIZE_CLASSES.md);
	});

	it('combines all classes correctly for inactive small item', () => {
		const classes = getItemClasses(false, 'sm');

		expect(classes).toContain(BOTTOM_NAV_ITEM_BASE_CLASSES);
		expect(classes).toContain(BOTTOM_NAV_ITEM_INACTIVE_CLASSES);
		expect(classes).toContain(BOTTOM_NAV_ITEM_SIZE_CLASSES.sm);
	});

	it('combines all classes correctly for active large item', () => {
		const classes = getItemClasses(true, 'lg');

		expect(classes).toContain(BOTTOM_NAV_ITEM_BASE_CLASSES);
		expect(classes).toContain(BOTTOM_NAV_ITEM_ACTIVE_CLASSES);
		expect(classes).toContain(BOTTOM_NAV_ITEM_SIZE_CLASSES.lg);
	});

	it('returns a string with merged classes', () => {
		const classes = getItemClasses(false, 'md');

		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('handles all size variants', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const activeClasses = getItemClasses(true, size);
			const inactiveClasses = getItemClasses(false, size);

			expect(activeClasses).toContain(BOTTOM_NAV_ITEM_SIZE_CLASSES[size]);
			expect(inactiveClasses).toContain(BOTTOM_NAV_ITEM_SIZE_CLASSES[size]);
		}
	});
});
