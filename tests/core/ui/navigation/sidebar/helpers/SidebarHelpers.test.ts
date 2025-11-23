import { SIDEBAR_COLLAPSED_WIDTH } from '@core/constants/ui/navigation';
import {
	getSidebarClasses,
	getSidebarWidth,
} from '@core/ui/navigation/sidebar/helpers/SidebarHelpers';
import { describe, expect, it } from 'vitest';

describe('SidebarHelpers - getSidebarWidth', () => {
	it('returns collapsed width when collapsed is true', () => {
		const result = getSidebarWidth(300, true);
		expect(result).toBe(SIDEBAR_COLLAPSED_WIDTH);
	});

	it('returns provided width when collapsed is false', () => {
		const result = getSidebarWidth(300, false);
		expect(result).toBe(300);
	});

	it('returns collapsed width for string width when collapsed', () => {
		const result = getSidebarWidth('400px', true);
		expect(result).toBe(SIDEBAR_COLLAPSED_WIDTH);
	});

	it('returns string width when collapsed is false', () => {
		const result = getSidebarWidth('400px', false);
		expect(result).toBe('400px');
	});

	it('handles zero width when not collapsed', () => {
		const result = getSidebarWidth(0, false);
		expect(result).toBe(0);
	});

	it('handles zero width when collapsed', () => {
		const result = getSidebarWidth(0, true);
		expect(result).toBe(SIDEBAR_COLLAPSED_WIDTH);
	});

	it('handles negative width when not collapsed', () => {
		const result = getSidebarWidth(-100, false);
		expect(result).toBe(-100);
	});

	it('handles negative width when collapsed', () => {
		const result = getSidebarWidth(-100, true);
		expect(result).toBe(SIDEBAR_COLLAPSED_WIDTH);
	});

	it('handles CSS calc width when not collapsed', () => {
		const result = getSidebarWidth('calc(100% - 20px)', false);
		expect(result).toBe('calc(100% - 20px)');
	});

	it('handles CSS calc width when collapsed', () => {
		const result = getSidebarWidth('calc(100% - 20px)', true);
		expect(result).toBe(SIDEBAR_COLLAPSED_WIDTH);
	});
});

describe('SidebarHelpers - getSidebarClasses', () => {
	it('returns base classes for left position with border', () => {
		const result = getSidebarClasses('left', true);
		expect(result).toContain('flex');
		expect(result).toContain('flex-col');
		expect(result).toContain('border-r');
	});

	it('returns base classes for right position with border', () => {
		const result = getSidebarClasses('right', true);
		expect(result).toContain('flex');
		expect(result).toContain('flex-col');
		expect(result).toContain('border-l');
	});

	it('returns base classes without border when showBorder is false', () => {
		const result = getSidebarClasses('left', false);
		expect(result).toContain('flex');
		expect(result).toContain('flex-col');
		expect(result).not.toContain('border-r');
		expect(result).not.toContain('border-l');
	});

	it('includes custom className when provided', () => {
		const result = getSidebarClasses('left', true, 'custom-class');
		expect(result).toContain('custom-class');
	});

	it('handles undefined className', () => {
		const result = getSidebarClasses('left', true);
		expect(result).toBeTruthy();
		expect(result).not.toContain('undefined');
	});

	it('handles empty string className', () => {
		const result = getSidebarClasses('left', true, '');
		expect(result).toBeTruthy();
		expect(result.trim()).toBe(result);
	});

	it('includes className with whitespace', () => {
		const result = getSidebarClasses('left', true, '  custom-class  ');
		expect(result).toContain('custom-class');
		// The implementation uses template literals which preserve whitespace
		expect(result).toBeTruthy();
	});

	it('combines multiple class sources correctly', () => {
		const result = getSidebarClasses('left', true, 'custom-class another-class');
		expect(result).toContain('flex');
		expect(result).toContain('border-r');
		expect(result).toContain('custom-class');
		expect(result).toContain('another-class');
	});

	it('handles right position with border and custom className', () => {
		const result = getSidebarClasses('right', true, 'my-custom-class');
		expect(result).toContain('flex');
		expect(result).toContain('border-l');
		expect(result).toContain('my-custom-class');
		expect(result).not.toContain('border-r');
	});

	it('handles left position without border and custom className', () => {
		const result = getSidebarClasses('left', false, 'no-border-class');
		expect(result).toContain('flex');
		expect(result).toContain('no-border-class');
		expect(result).not.toContain('border-r');
		expect(result).not.toContain('border-l');
	});
});
