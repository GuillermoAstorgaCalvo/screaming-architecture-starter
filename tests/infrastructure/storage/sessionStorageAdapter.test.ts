import { SessionStorageAdapter } from '@infra/storage/sessionStorageAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	createSsrAdapter,
	KEY,
	QUOTA_EXCEEDED_ERROR,
	VALUE,
} from './sessionStorageAdapter.test-utils';

describe('SessionStorageAdapter - SSR Safety', () => {
	let originalWindow: Window & typeof globalThis;

	beforeEach(() => {
		originalWindow = globalThis.window;
	});

	afterEach(() => {
		if (originalWindow) {
			globalThis.window = originalWindow;
		}
		vi.restoreAllMocks();
	});

	describe('Window undefined', () => {
		it('should return null for getItem when window is undefined', () => {
			const ssrAdapter = createSsrAdapter();
			expect(ssrAdapter.getItem(KEY)).toBeNull();
		});

		it('should return false for setItem when window is undefined', () => {
			const ssrAdapter = createSsrAdapter();
			expect(ssrAdapter.setItem(KEY, VALUE)).toBe(false);
		});

		it('should return false for removeItem when window is undefined', () => {
			const ssrAdapter = createSsrAdapter();
			expect(ssrAdapter.removeItem(KEY)).toBe(false);
		});

		it('should return false for clear when window is undefined', () => {
			const ssrAdapter = createSsrAdapter();
			expect(ssrAdapter.clear()).toBe(false);
		});

		it('should return 0 for getLength when window is undefined', () => {
			const ssrAdapter = createSsrAdapter();
			expect(ssrAdapter.getLength()).toBe(0);
		});

		it('should return null for key when window is undefined', () => {
			const ssrAdapter = createSsrAdapter();
			expect(ssrAdapter.key(0)).toBeNull();
		});
	});
});

describe('SessionStorageAdapter - SSR Safety (Storage null/disabled)', () => {
	let originalWindow: Window & typeof globalThis;

	beforeEach(() => {
		originalWindow = globalThis.window;
	});

	afterEach(() => {
		if (originalWindow) {
			globalThis.window = originalWindow;
		}
		vi.restoreAllMocks();
	});

	describe('SessionStorage null', () => {
		it('should handle sessionStorage being null', () => {
			Object.defineProperty(globalThis, 'window', {
				value: {},
				writable: true,
				configurable: true,
			});
			const noStorageAdapter = new SessionStorageAdapter();
			expect(noStorageAdapter.getItem(KEY)).toBeNull();
			expect(noStorageAdapter.setItem(KEY, VALUE)).toBe(false);
		});
	});

	describe('SessionStorage disabled', () => {
		it('should handle sessionStorage being disabled (private browsing)', () => {
			const mockSessionStorage = {
				setItem: vi.fn(() => {
					throw new Error(QUOTA_EXCEEDED_ERROR);
				}),
				getItem: vi.fn(),
				removeItem: vi.fn(),
				clear: vi.fn(),
				length: 0,
				key: vi.fn(),
			};

			Object.defineProperty(globalThis, 'window', {
				value: { sessionStorage: mockSessionStorage },
				writable: true,
				configurable: true,
			});

			const disabledAdapter = new SessionStorageAdapter();
			expect(disabledAdapter.getItem(KEY)).toBeNull();
			expect(disabledAdapter.setItem(KEY, VALUE)).toBe(false);
		});
	});
});
