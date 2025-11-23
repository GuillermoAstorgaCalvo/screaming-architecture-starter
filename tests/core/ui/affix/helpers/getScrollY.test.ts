/**
 * Tests for getScrollY helper function
 */

import { getScrollY } from '@core/ui/affix/helpers/useAffix.helpers';
import { describe, expect, it, vi } from 'vitest';

describe('useAffix.helpers - getScrollY', () => {
	it('returns container scrollTop when container is provided', () => {
		const container = document.createElement('div');
		container.scrollTop = 150;
		expect(getScrollY(container)).toBe(150);
	});

	it('returns window.scrollY when container is null', () => {
		const mockScrollY = vi.fn(() => 200);
		Object.defineProperty(globalThis.window, 'scrollY', {
			configurable: true,
			get: mockScrollY,
		});

		expect(getScrollY(null)).toBe(200);
	});

	it('returns window.scrollY when container is undefined', () => {
		const mockScrollY = vi.fn(() => 300);
		Object.defineProperty(globalThis.window, 'scrollY', {
			configurable: true,
			get: mockScrollY,
		});

		expect(getScrollY(undefined)).toBe(300);
	});

	it('falls back to document.documentElement.scrollTop when window.scrollY is 0', () => {
		const mockScrollY = vi.fn(() => 0);
		const mockScrollTop = vi.fn(() => 250);
		Object.defineProperty(globalThis.window, 'scrollY', {
			configurable: true,
			get: mockScrollY,
		});
		Object.defineProperty(document.documentElement, 'scrollTop', {
			configurable: true,
			get: mockScrollTop,
		});

		expect(getScrollY(null)).toBe(250);
	});

	it('handles zero scroll position', () => {
		const container = document.createElement('div');
		container.scrollTop = 0;
		expect(getScrollY(container)).toBe(0);
	});

	it('handles negative scroll position', () => {
		const container = document.createElement('div');
		container.scrollTop = -50;
		expect(getScrollY(container)).toBe(-50);
	});
});
