/**
 * Tests for getScrollX helper function
 */

import { getScrollX } from '@core/ui/affix/helpers/useAffix.helpers';
import { describe, expect, it, vi } from 'vitest';

describe('useAffix.helpers - getScrollX', () => {
	it('returns container scrollLeft when container is provided', () => {
		const container = document.createElement('div');
		container.scrollLeft = 150;
		expect(getScrollX(container)).toBe(150);
	});

	it('returns window.scrollX when container is null', () => {
		const mockScrollX = vi.fn(() => 200);
		Object.defineProperty(globalThis.window, 'scrollX', {
			configurable: true,
			get: mockScrollX,
		});

		expect(getScrollX(null)).toBe(200);
	});

	it('returns window.scrollX when container is undefined', () => {
		const mockScrollX = vi.fn(() => 300);
		Object.defineProperty(globalThis.window, 'scrollX', {
			configurable: true,
			get: mockScrollX,
		});

		expect(getScrollX(undefined)).toBe(300);
	});

	it('falls back to document.documentElement.scrollLeft when window.scrollX is 0', () => {
		const mockScrollX = vi.fn(() => 0);
		const mockScrollLeft = vi.fn(() => 250);
		Object.defineProperty(globalThis.window, 'scrollX', {
			configurable: true,
			get: mockScrollX,
		});
		Object.defineProperty(document.documentElement, 'scrollLeft', {
			configurable: true,
			get: mockScrollLeft,
		});

		expect(getScrollX(null)).toBe(250);
	});

	it('handles zero scroll position', () => {
		const container = document.createElement('div');
		container.scrollLeft = 0;
		expect(getScrollX(container)).toBe(0);
	});

	it('handles negative scroll position', () => {
		const container = document.createElement('div');
		container.scrollLeft = -50;
		expect(getScrollX(container)).toBe(-50);
	});
});
