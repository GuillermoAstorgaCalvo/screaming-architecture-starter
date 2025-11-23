/**
 * MenubarHelpers Tests
 *
 * Tests for menubar helper functions:
 * - getMenubarClasses
 * - getMenubarItemClasses
 * - getMenubarSubmenuClasses
 */

import {
	getMenubarClasses,
	getMenubarItemClasses,
	getMenubarSubmenuClasses,
} from '@core/ui/navigation/menubar/helpers/MenubarHelpers';
import { describe, expect, it } from 'vitest';

describe('getMenubarClasses', () => {
	it('returns base classes without custom className', () => {
		const classes = getMenubarClasses({});
		expect(classes).toContain('flex');
		expect(classes).toContain('items-center');
		expect(classes).toContain('border-b');
	});

	it('appends custom className when provided', () => {
		const classes = getMenubarClasses({ className: 'custom-class' });
		expect(classes).toContain('custom-class');
		expect(classes).toContain('flex');
	});

	it('handles undefined className', () => {
		const classes = getMenubarClasses({ className: undefined });
		expect(classes).toBeTruthy();
		expect(classes).toContain('flex');
	});
});

describe('getMenubarItemClasses', () => {
	it('returns base classes for inactive item', () => {
		const classes = getMenubarItemClasses({ isActive: false, disabled: false });
		expect(classes).toContain('inline-flex');
		expect(classes).toContain('items-center');
	});

	it('applies active state classes when isActive is true', () => {
		const classes = getMenubarItemClasses({ isActive: true, disabled: false });
		expect(classes).toContain('bg-muted');
		expect(classes).toContain('text-text-primary');
	});

	it('applies inactive state classes when isActive is false', () => {
		const classes = getMenubarItemClasses({ isActive: false, disabled: false });
		expect(classes).toContain('text-text-secondary');
		expect(classes).toContain('hover:bg-muted');
	});

	it('includes disabled classes when disabled is true', () => {
		const classes = getMenubarItemClasses({ isActive: false, disabled: true });
		expect(classes).toContain('disabled:cursor-not-allowed');
		expect(classes).toContain('disabled:opacity-disabled');
	});

	it('handles active and disabled states together', () => {
		const classes = getMenubarItemClasses({ isActive: true, disabled: true });
		expect(classes).toContain('bg-muted');
		expect(classes).toContain('disabled:cursor-not-allowed');
	});
});

describe('getMenubarSubmenuClasses', () => {
	it('returns base classes without custom className', () => {
		const classes = getMenubarSubmenuClasses();
		expect(classes).toContain('w-56');
		expect(classes).toContain('rounded-lg');
		expect(classes).toContain('border');
	});

	it('appends custom className when provided', () => {
		const classes = getMenubarSubmenuClasses({ className: 'custom-submenu' });
		expect(classes).toContain('custom-submenu');
		expect(classes).toContain('w-56');
	});

	it('handles empty object parameter', () => {
		const classes = getMenubarSubmenuClasses({});
		expect(classes).toBeTruthy();
		expect(classes).toContain('w-56');
	});
});
