/**
 * tooltipUtils Tests
 *
 * Tests for tooltip utility functions:
 * - getPositionClasses: CSS classes for different positions
 * - getArrowClasses: CSS classes for arrow positioning
 */

import {
	getArrowClasses,
	getPositionClasses,
} from '@core/ui/overlays/tooltip/helpers/tooltipUtils';
import type { TooltipProps } from '@src-types/ui/overlays/floating';
import { describe, expect, it } from 'vitest';

describe('tooltipUtils', () => {
	describe('getPositionClasses', () => {
		it('should return correct classes for top position', () => {
			const result = getPositionClasses('top');
			expect(result).toBe('bottom-full left-1/2 -translate-x-1/2 mb-2');
		});

		it('should return correct classes for bottom position', () => {
			const result = getPositionClasses('bottom');
			expect(result).toBe('top-full left-1/2 -translate-x-1/2 mt-2');
		});

		it('should return correct classes for left position', () => {
			const result = getPositionClasses('left');
			expect(result).toBe('right-full top-1/2 -translate-y-1/2 mr-2');
		});

		it('should return correct classes for right position', () => {
			const result = getPositionClasses('right');
			expect(result).toBe('left-full top-1/2 -translate-y-1/2 ml-2');
		});

		it('should return default classes (top) for undefined position', () => {
			const result = getPositionClasses(undefined as unknown as TooltipProps['position']);
			expect(result).toBe('bottom-full left-1/2 -translate-x-1/2 mb-2');
		});

		it('should return a non-empty string for all positions', () => {
			const positions: TooltipProps['position'][] = ['top', 'bottom', 'left', 'right'];
			for (const position of positions) {
				const result = getPositionClasses(position);
				expect(result).toBeTruthy();
				expect(typeof result).toBe('string');
				expect(result.length).toBeGreaterThan(0);
			}
		});

		it('should return different classes for different positions', () => {
			const topClasses = getPositionClasses('top');
			const bottomClasses = getPositionClasses('bottom');
			const leftClasses = getPositionClasses('left');
			const rightClasses = getPositionClasses('right');

			expect(topClasses).not.toBe(bottomClasses);
			expect(topClasses).not.toBe(leftClasses);
			expect(topClasses).not.toBe(rightClasses);
			expect(bottomClasses).not.toBe(leftClasses);
			expect(bottomClasses).not.toBe(rightClasses);
			expect(leftClasses).not.toBe(rightClasses);
		});
	});

	describe('getArrowClasses', () => {
		it('should return correct classes for top position', () => {
			const result = getArrowClasses('top');
			expect(result).toContain('absolute');
			expect(result).toContain('w-2');
			expect(result).toContain('h-2');
			expect(result).toContain('top-full');
			expect(result).toContain('left-1/2');
			expect(result).toContain('-translate-x-1/2');
			expect(result).toContain('-mt-1');
			expect(result).toContain('rotate-45');
		});

		it('should return correct classes for bottom position', () => {
			const result = getArrowClasses('bottom');
			expect(result).toContain('absolute');
			expect(result).toContain('w-2');
			expect(result).toContain('h-2');
			expect(result).toContain('bottom-full');
			expect(result).toContain('left-1/2');
			expect(result).toContain('-translate-x-1/2');
			expect(result).toContain('-mb-1');
			expect(result).toContain('rotate-45');
		});

		it('should return correct classes for left position', () => {
			const result = getArrowClasses('left');
			expect(result).toContain('absolute');
			expect(result).toContain('w-2');
			expect(result).toContain('h-2');
			expect(result).toContain('left-full');
			expect(result).toContain('top-1/2');
			expect(result).toContain('-translate-y-1/2');
			expect(result).toContain('-ml-1');
			expect(result).toContain('rotate-45');
		});

		it('should return correct classes for right position', () => {
			const result = getArrowClasses('right');
			expect(result).toContain('absolute');
			expect(result).toContain('w-2');
			expect(result).toContain('h-2');
			expect(result).toContain('right-full');
			expect(result).toContain('top-1/2');
			expect(result).toContain('-translate-y-1/2');
			expect(result).toContain('-mr-1');
			expect(result).toContain('rotate-45');
		});

		it('should return default classes (top) for undefined position', () => {
			const result = getArrowClasses(undefined as unknown as TooltipProps['position']);
			expect(result).toContain('absolute');
			expect(result).toContain('top-full');
			expect(result).toContain('rotate-45');
		});

		it('should include base classes for all positions', () => {
			const positions: TooltipProps['position'][] = ['top', 'bottom', 'left', 'right'];
			for (const position of positions) {
				const result = getArrowClasses(position);
				expect(result).toContain('absolute');
				expect(result).toContain('w-2');
				expect(result).toContain('h-2');
				expect(result).toContain('bg-surface-elevated');
				expect(result).toContain('dark:bg-surface-elevated');
				expect(result).toContain('rotate-45');
			}
		});

		it('should return different classes for different positions', () => {
			const topClasses = getArrowClasses('top');
			const bottomClasses = getArrowClasses('bottom');
			const leftClasses = getArrowClasses('left');
			const rightClasses = getArrowClasses('right');

			expect(topClasses).not.toBe(bottomClasses);
			expect(topClasses).not.toBe(leftClasses);
			expect(topClasses).not.toBe(rightClasses);
			expect(bottomClasses).not.toBe(leftClasses);
			expect(bottomClasses).not.toBe(rightClasses);
			expect(leftClasses).not.toBe(rightClasses);
		});
	});
});
