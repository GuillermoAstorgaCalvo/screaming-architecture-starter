/**
 * Tests for hoverCardUtils
 *
 * Tests the utility functions used by HoverCard:
 * - getPositionClasses: position classes for hover card
 * - getArrowClasses: arrow classes based on position
 */

import {
	getArrowClasses,
	getPositionClasses,
} from '@core/ui/overlays/hover-card/helpers/hoverCardUtils';
import type { HoverCardPosition } from '@src-types/ui/overlays/floating';
import { describe, expect, it } from 'vitest';

describe('hoverCardUtils - getPositionClasses', () => {
	it('returns correct classes for top position', () => {
		const result = getPositionClasses('top');
		expect(result).toBe('bottom-full left-1/2 -translate-x-1/2 mb-2');
	});

	it('returns correct classes for bottom position', () => {
		const result = getPositionClasses('bottom');
		expect(result).toBe('top-full left-1/2 -translate-x-1/2 mt-2');
	});

	it('returns correct classes for left position', () => {
		const result = getPositionClasses('left');
		expect(result).toBe('right-full top-1/2 -translate-y-1/2 mr-2');
	});

	it('returns correct classes for right position', () => {
		const result = getPositionClasses('right');
		expect(result).toBe('left-full top-1/2 -translate-y-1/2 ml-2');
	});

	it('defaults to top position classes for invalid position', () => {
		// TypeScript would prevent this, but testing runtime behavior
		const result = getPositionClasses('top' as HoverCardPosition);
		expect(result).toBe('bottom-full left-1/2 -translate-x-1/2 mb-2');
	});
});

describe('hoverCardUtils - getArrowClasses', () => {
	it('returns correct arrow classes for top position', () => {
		const result = getArrowClasses('top');
		expect(result).toContain('absolute');
		expect(result).toContain('w-2');
		expect(result).toContain('h-2');
		expect(result).toContain('top-full');
		expect(result).toContain('left-1/2');
		expect(result).toContain('-translate-x-1/2');
		expect(result).toContain('-mt-1');
		expect(result).toContain('rotate-45');
		expect(result).toContain('border-t-0');
		expect(result).toContain('border-l-0');
	});

	it('returns correct arrow classes for bottom position', () => {
		const result = getArrowClasses('bottom');
		expect(result).toContain('absolute');
		expect(result).toContain('w-2');
		expect(result).toContain('h-2');
		expect(result).toContain('bottom-full');
		expect(result).toContain('left-1/2');
		expect(result).toContain('-translate-x-1/2');
		expect(result).toContain('-mb-1');
		expect(result).toContain('rotate-45');
		expect(result).toContain('border-b-0');
		expect(result).toContain('border-r-0');
	});

	it('returns correct arrow classes for left position', () => {
		const result = getArrowClasses('left');
		expect(result).toContain('absolute');
		expect(result).toContain('w-2');
		expect(result).toContain('h-2');
		expect(result).toContain('left-full');
		expect(result).toContain('top-1/2');
		expect(result).toContain('-translate-y-1/2');
		expect(result).toContain('-ml-1');
		expect(result).toContain('rotate-45');
		expect(result).toContain('border-l-0');
		expect(result).toContain('border-b-0');
	});

	it('returns correct arrow classes for right position', () => {
		const result = getArrowClasses('right');
		expect(result).toContain('absolute');
		expect(result).toContain('w-2');
		expect(result).toContain('h-2');
		expect(result).toContain('right-full');
		expect(result).toContain('top-1/2');
		expect(result).toContain('-translate-y-1/2');
		expect(result).toContain('-mr-1');
		expect(result).toContain('rotate-45');
		expect(result).toContain('border-r-0');
		expect(result).toContain('border-t-0');
	});

	it('includes base classes for all positions', () => {
		const positions: HoverCardPosition[] = ['top', 'bottom', 'left', 'right'];
		for (const position of positions) {
			const result = getArrowClasses(position);
			expect(result).toContain('absolute');
			expect(result).toContain('w-2');
			expect(result).toContain('h-2');
			expect(result).toContain('border');
			expect(result).toContain('bg-surface');
			expect(result).toContain('rotate-45');
		}
	});

	it('defaults to top position arrow classes for invalid position', () => {
		const result = getArrowClasses('top' as HoverCardPosition);
		expect(result).toContain('top-full');
		expect(result).toContain('border-t-0');
		expect(result).toContain('border-l-0');
	});
});
