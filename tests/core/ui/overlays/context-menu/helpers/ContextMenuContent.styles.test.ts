/**
 * ContextMenuContent.styles Tests
 *
 * Tests for the MENU_STYLES constant including:
 * - Style constants are defined
 * - Style constants have correct values
 */

import { MENU_STYLES } from '@core/ui/overlays/context-menu/helpers/ContextMenuContent.styles';
import { describe, expect, it } from 'vitest';

describe('MENU_STYLES', () => {
	it('defines CONTAINER style', () => {
		expect(MENU_STYLES.CONTAINER).toBeDefined();
		expect(typeof MENU_STYLES.CONTAINER).toBe('string');
		expect(MENU_STYLES.CONTAINER).toContain('flex');
		expect(MENU_STYLES.CONTAINER).toContain('flex-col');
	});

	it('defines EMPTY_STATE style', () => {
		expect(MENU_STYLES.EMPTY_STATE).toBeDefined();
		expect(typeof MENU_STYLES.EMPTY_STATE).toBe('string');
		expect(MENU_STYLES.EMPTY_STATE).toContain('text-sm');
		expect(MENU_STYLES.EMPTY_STATE).toContain('text-muted-foreground');
	});

	it('defines MENU_WRAPPER style', () => {
		expect(MENU_STYLES.MENU_WRAPPER).toBeDefined();
		expect(typeof MENU_STYLES.MENU_WRAPPER).toBe('string');
		expect(MENU_STYLES.MENU_WRAPPER).toContain('max-h-[--menu-max-height]');
		expect(MENU_STYLES.MENU_WRAPPER).toContain('overflow-y-auto');
	});

	it('defines POPOVER_BASE style', () => {
		expect(MENU_STYLES.POPOVER_BASE).toBeDefined();
		expect(typeof MENU_STYLES.POPOVER_BASE).toBe('string');
		expect(MENU_STYLES.POPOVER_BASE).toContain('rounded-lg');
		expect(MENU_STYLES.POPOVER_BASE).toContain('border');
		expect(MENU_STYLES.POPOVER_BASE).toContain('bg-popover');
	});

	it('is a constant object', () => {
		// The object is defined as const, ensuring immutability at compile time
		expect(MENU_STYLES).toBeDefined();
		expect(typeof MENU_STYLES).toBe('object');
	});

	it('has all required style properties', () => {
		expect(MENU_STYLES).toHaveProperty('CONTAINER');
		expect(MENU_STYLES).toHaveProperty('EMPTY_STATE');
		expect(MENU_STYLES).toHaveProperty('MENU_WRAPPER');
		expect(MENU_STYLES).toHaveProperty('POPOVER_BASE');
	});
});
