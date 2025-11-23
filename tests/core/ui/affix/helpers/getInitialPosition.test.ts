/**
 * Tests for getInitialPosition helper function
 */

import { getInitialPosition } from '@core/ui/affix/helpers/useAffix.helpers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('useAffix.helpers - getInitialPosition - top position', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('calculates initial position for top position with container', () => {
		const element = document.createElement('div');
		const container = document.createElement('div');
		container.scrollTop = 100;

		vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
			top: 50,
			left: 0,
			right: 100,
			bottom: 150,
			width: 100,
			height: 100,
			x: 0,
			y: 50,
			toJSON: vi.fn(),
		});

		expect(getInitialPosition(element, 'top', container)).toBe(150); // 50 + 100
	});

	it('calculates initial position for top position without container', () => {
		const element = document.createElement('div');
		const mockScrollY = vi.fn(() => 200);
		Object.defineProperty(globalThis.window, 'scrollY', {
			configurable: true,
			get: mockScrollY,
		});

		vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
			top: 50,
			left: 0,
			right: 100,
			bottom: 150,
			width: 100,
			height: 100,
			x: 0,
			y: 50,
			toJSON: vi.fn(),
		});

		expect(getInitialPosition(element, 'top', null)).toBe(250); // 50 + 200
	});
});

describe('useAffix.helpers - getInitialPosition - bottom position', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('calculates initial position for bottom position with container', () => {
		const element = document.createElement('div');
		const container = document.createElement('div');
		container.scrollTop = 100;

		vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
			top: 50,
			left: 0,
			right: 100,
			bottom: 150,
			width: 100,
			height: 100,
			x: 0,
			y: 50,
			toJSON: vi.fn(),
		});

		expect(getInitialPosition(element, 'bottom', container)).toBe(150); // 50 + 100
	});
});

describe('useAffix.helpers - getInitialPosition - left position', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('calculates initial position for left position with container', () => {
		const element = document.createElement('div');
		const container = document.createElement('div');
		container.scrollLeft = 100;

		vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
			top: 0,
			left: 50,
			right: 150,
			bottom: 100,
			width: 100,
			height: 100,
			x: 50,
			y: 0,
			toJSON: vi.fn(),
		});

		expect(getInitialPosition(element, 'left', container)).toBe(150); // 50 + 100
	});

	it('calculates initial position for left position without container', () => {
		const element = document.createElement('div');
		const mockScrollX = vi.fn(() => 200);
		Object.defineProperty(globalThis.window, 'scrollX', {
			configurable: true,
			get: mockScrollX,
		});

		vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
			top: 0,
			left: 50,
			right: 150,
			bottom: 100,
			width: 100,
			height: 100,
			x: 50,
			y: 0,
			toJSON: vi.fn(),
		});

		expect(getInitialPosition(element, 'left', null)).toBe(250); // 50 + 200
	});
});

describe('useAffix.helpers - getInitialPosition - right position', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('calculates initial position for right position with container', () => {
		const element = document.createElement('div');
		const container = document.createElement('div');
		container.scrollLeft = 100;

		vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
			top: 0,
			left: 50,
			right: 150,
			bottom: 100,
			width: 100,
			height: 100,
			x: 50,
			y: 0,
			toJSON: vi.fn(),
		});

		expect(getInitialPosition(element, 'right', container)).toBe(150); // 50 + 100
	});
});

describe('useAffix.helpers - getInitialPosition - edge cases', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('handles zero scroll position', () => {
		const element = document.createElement('div');
		const container = document.createElement('div');
		container.scrollTop = 0;

		vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
			top: 100,
			left: 0,
			right: 100,
			bottom: 200,
			width: 100,
			height: 100,
			x: 0,
			y: 100,
			toJSON: vi.fn(),
		});

		expect(getInitialPosition(element, 'top', container)).toBe(100);
	});

	it('handles negative bounding rect values', () => {
		const element = document.createElement('div');
		const container = document.createElement('div');
		container.scrollTop = 200;

		vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
			top: -50,
			left: 0,
			right: 50,
			bottom: 50,
			width: 50,
			height: 100,
			x: 0,
			y: -50,
			toJSON: vi.fn(),
		});

		expect(getInitialPosition(element, 'top', container)).toBe(150); // -50 + 200
	});
});
