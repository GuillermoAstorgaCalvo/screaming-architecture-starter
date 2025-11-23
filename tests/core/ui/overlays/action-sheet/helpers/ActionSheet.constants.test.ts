import {
	ACTION_SHEET_ACTION_BASE_CLASSES,
	ACTION_SHEET_ACTION_DEFAULT_CLASSES,
	ACTION_SHEET_ACTION_DESTRUCTIVE_CLASSES,
	ACTION_SHEET_BASE_CLASSES,
	ACTION_SHEET_CANCEL_CLASSES,
	ACTION_SHEET_CONTAINER_CLASSES,
	ACTION_SHEET_SEPARATOR_CLASSES,
	ACTION_SHEET_TITLE_CLASSES,
	ACTION_SHEET_Z_INDEX,
} from '@core/ui/overlays/action-sheet/helpers/ActionSheet.constants';
import { componentZIndex } from '@core/ui/theme/tokens';
import { describe, expect, it } from 'vitest';

describe('ActionSheet Constants', () => {
	it('exports ACTION_SHEET_BASE_CLASSES', () => {
		expect(ACTION_SHEET_BASE_CLASSES).toBeDefined();
		expect(typeof ACTION_SHEET_BASE_CLASSES).toBe('string');
		expect(ACTION_SHEET_BASE_CLASSES).toContain('fixed');
		expect(ACTION_SHEET_BASE_CLASSES).toContain('bottom-0');
	});

	it('exports ACTION_SHEET_Z_INDEX with correct value', () => {
		expect(ACTION_SHEET_Z_INDEX).toBeDefined();
		expect(ACTION_SHEET_Z_INDEX).toBe(componentZIndex.modal);
	});

	it('exports ACTION_SHEET_CONTAINER_CLASSES', () => {
		expect(ACTION_SHEET_CONTAINER_CLASSES).toBeDefined();
		expect(typeof ACTION_SHEET_CONTAINER_CLASSES).toBe('string');
		expect(ACTION_SHEET_CONTAINER_CLASSES).toContain('overflow-y-auto');
	});

	it('exports ACTION_SHEET_TITLE_CLASSES', () => {
		expect(ACTION_SHEET_TITLE_CLASSES).toBeDefined();
		expect(typeof ACTION_SHEET_TITLE_CLASSES).toBe('string');
		expect(ACTION_SHEET_TITLE_CLASSES).toContain('px-lg');
		expect(ACTION_SHEET_TITLE_CLASSES).toContain('py-md');
	});

	it('exports ACTION_SHEET_ACTION_BASE_CLASSES', () => {
		expect(ACTION_SHEET_ACTION_BASE_CLASSES).toBeDefined();
		expect(typeof ACTION_SHEET_ACTION_BASE_CLASSES).toBe('string');
		expect(ACTION_SHEET_ACTION_BASE_CLASSES).toContain('w-full');
		expect(ACTION_SHEET_ACTION_BASE_CLASSES).toContain('flex');
	});

	it('exports ACTION_SHEET_ACTION_DEFAULT_CLASSES', () => {
		expect(ACTION_SHEET_ACTION_DEFAULT_CLASSES).toBeDefined();
		expect(typeof ACTION_SHEET_ACTION_DEFAULT_CLASSES).toBe('string');
		expect(ACTION_SHEET_ACTION_DEFAULT_CLASSES).toContain('text-text-primary');
	});

	it('exports ACTION_SHEET_ACTION_DESTRUCTIVE_CLASSES', () => {
		expect(ACTION_SHEET_ACTION_DESTRUCTIVE_CLASSES).toBeDefined();
		expect(typeof ACTION_SHEET_ACTION_DESTRUCTIVE_CLASSES).toBe('string');
		expect(ACTION_SHEET_ACTION_DESTRUCTIVE_CLASSES).toContain('text-error');
	});

	it('exports ACTION_SHEET_CANCEL_CLASSES', () => {
		expect(ACTION_SHEET_CANCEL_CLASSES).toBeDefined();
		expect(typeof ACTION_SHEET_CANCEL_CLASSES).toBe('string');
		expect(ACTION_SHEET_CANCEL_CLASSES).toContain('rounded-lg');
		expect(ACTION_SHEET_CANCEL_CLASSES).toContain('font-medium');
	});

	it('exports ACTION_SHEET_SEPARATOR_CLASSES', () => {
		expect(ACTION_SHEET_SEPARATOR_CLASSES).toBeDefined();
		expect(typeof ACTION_SHEET_SEPARATOR_CLASSES).toBe('string');
		expect(ACTION_SHEET_SEPARATOR_CLASSES).toContain('border-t');
	});

	it('ACTION_SHEET_BASE_CLASSES contains expected classes', () => {
		expect(ACTION_SHEET_BASE_CLASSES).toContain('fixed');
		expect(ACTION_SHEET_BASE_CLASSES).toContain('bottom-0');
		expect(ACTION_SHEET_BASE_CLASSES).toContain('left-0');
		expect(ACTION_SHEET_BASE_CLASSES).toContain('right-0');
		expect(ACTION_SHEET_BASE_CLASSES).toContain('bg-background');
		expect(ACTION_SHEET_BASE_CLASSES).toContain('rounded-t-lg');
	});

	it('ACTION_SHEET_ACTION_BASE_CLASSES contains expected classes', () => {
		expect(ACTION_SHEET_ACTION_BASE_CLASSES).toContain('w-full');
		expect(ACTION_SHEET_ACTION_BASE_CLASSES).toContain('flex');
		expect(ACTION_SHEET_ACTION_BASE_CLASSES).toContain('items-center');
		expect(ACTION_SHEET_ACTION_BASE_CLASSES).toContain('text-left');
	});

	it('ACTION_SHEET_ACTION_DESTRUCTIVE_CLASSES contains error styling', () => {
		expect(ACTION_SHEET_ACTION_DESTRUCTIVE_CLASSES).toContain('text-error');
		expect(ACTION_SHEET_ACTION_DESTRUCTIVE_CLASSES).toContain('hover:bg-error');
	});
});
