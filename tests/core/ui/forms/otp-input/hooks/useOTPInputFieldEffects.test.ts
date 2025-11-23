/**
 * useOTPInputFieldEffects Tests
 *
 * Tests for field effects hook:
 * - useOTPInputFieldEffects
 * - Ref array length management
 * - Auto-focus behavior
 */

import { useOTPInputFieldEffects } from '@core/ui/forms/otp-input/hooks/useOTPInputFieldEffects';
import { renderHook } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('useOTPInputFieldEffects', () => {
	it('should be a function', () => {
		expect(typeof useOTPInputFieldEffects).toBe('function');
	});

	it('should not throw when called', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];

		expect(() => {
			renderHook(() =>
				useOTPInputFieldEffects({
					length: 6,
					autoFocus: false,
					inputRefs,
				})
			);
		}).not.toThrow();
	});
});

describe('useOTPInputFieldEffects - Ref Array Length Management', () => {
	it('should trim refs array when length decreases', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [null, null, null, null, null, null];

		const { rerender } = renderHook(
			({ length }) =>
				useOTPInputFieldEffects({
					length,
					autoFocus: false,
					inputRefs,
				}),
			{
				initialProps: { length: 6 },
			}
		);

		expect(inputRefs.current.length).toBe(6);

		rerender({ length: 4 });

		// Should trim to new length
		expect(inputRefs.current.length).toBe(4);
	});

	it('should not modify refs array when length increases', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [null, null, null, null];

		const { rerender } = renderHook(
			({ length }) =>
				useOTPInputFieldEffects({
					length,
					autoFocus: false,
					inputRefs,
				}),
			{
				initialProps: { length: 4 },
			}
		);

		expect(inputRefs.current.length).toBe(4);

		rerender({ length: 6 });

		// Should not modify when length increases
		expect(inputRefs.current.length).toBe(4);
	});

	it('should not modify refs array when length matches', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [null, null, null, null, null, null];

		renderHook(() =>
			useOTPInputFieldEffects({
				length: 6,
				autoFocus: false,
				inputRefs,
			})
		);

		expect(inputRefs.current.length).toBe(6);
	});

	it('should handle empty refs array', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];

		renderHook(() =>
			useOTPInputFieldEffects({
				length: 6,
				autoFocus: false,
				inputRefs,
			})
		);

		expect(inputRefs.current.length).toBe(0);
	});

	it('should handle refs array shorter than length', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [null, null];

		renderHook(() =>
			useOTPInputFieldEffects({
				length: 6,
				autoFocus: false,
				inputRefs,
			})
		);

		expect(inputRefs.current.length).toBe(2);
	});
});

describe('useOTPInputFieldEffects - Auto-Focus', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it('should focus first input when autoFocus is true', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		const mockInput = {
			focus: vi.fn(),
		} as unknown as HTMLInputElement;
		inputRefs.current = [mockInput, null, null, null, null, null];

		renderHook(() =>
			useOTPInputFieldEffects({
				length: 6,
				autoFocus: true,
				inputRefs,
			})
		);

		vi.advanceTimersByTime(0);

		expect(mockInput.focus).toHaveBeenCalled();
	});

	it('should not focus when autoFocus is false', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		const mockInput = {
			focus: vi.fn(),
		} as unknown as HTMLInputElement;
		inputRefs.current = [mockInput, null, null, null, null, null];

		renderHook(() =>
			useOTPInputFieldEffects({
				length: 6,
				autoFocus: false,
				inputRefs,
			})
		);

		vi.advanceTimersByTime(0);

		expect(mockInput.focus).not.toHaveBeenCalled();
	});

	it('should not focus when autoFocus is undefined', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		const mockInput = {
			focus: vi.fn(),
		} as unknown as HTMLInputElement;
		inputRefs.current = [mockInput, null, null, null, null, null];

		renderHook(() =>
			useOTPInputFieldEffects({
				length: 6,
				autoFocus: undefined,
				inputRefs,
			})
		);

		vi.advanceTimersByTime(0);

		expect(mockInput.focus).not.toHaveBeenCalled();
	});

	it('should not focus when first input is not available', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [null, null, null, null, null, null];

		expect(() => {
			renderHook(() =>
				useOTPInputFieldEffects({
					length: 6,
					autoFocus: true,
					inputRefs,
				})
			);

			vi.advanceTimersByTime(0);
		}).not.toThrow();
	});

	it('should focus first input after refs are populated', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		const mockInput = {
			focus: vi.fn(),
		} as unknown as HTMLInputElement;
		inputRefs.current = [];

		const { rerender } = renderHook(
			({ autoFocus }) =>
				useOTPInputFieldEffects({
					length: 6,
					autoFocus,
					inputRefs,
				}),
			{
				initialProps: { autoFocus: true },
			}
		);

		vi.advanceTimersByTime(0);

		// Populate refs
		inputRefs.current = [mockInput, null, null, null, null, null];

		rerender({ autoFocus: true });

		// Advance timers to trigger the timeout and interval
		vi.advanceTimersByTime(20);

		expect(mockInput.focus).toHaveBeenCalled();
	});

	it('should cleanup timeout on unmount', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		const mockInput = {
			focus: vi.fn(),
		} as unknown as HTMLInputElement;
		inputRefs.current = [mockInput, null, null, null, null, null];

		const { unmount } = renderHook(() =>
			useOTPInputFieldEffects({
				length: 6,
				autoFocus: true,
				inputRefs,
			})
		);

		unmount();

		vi.advanceTimersByTime(0);

		// Focus should not be called after unmount
		expect(mockInput.focus).not.toHaveBeenCalled();
	});
});

describe('useOTPInputFieldEffects - Integration', () => {
	it('should handle both ref management and auto-focus together', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		const mockInput = {
			focus: vi.fn(),
		} as unknown as HTMLInputElement;
		inputRefs.current = [mockInput, null, null, null, null, null, null, null];

		vi.useFakeTimers();

		renderHook(() =>
			useOTPInputFieldEffects({
				length: 6,
				autoFocus: true,
				inputRefs,
			})
		);

		// Should trim refs array
		expect(inputRefs.current.length).toBe(6);

		// Should focus first input
		vi.advanceTimersByTime(0);
		expect(mockInput.focus).toHaveBeenCalled();

		vi.useRealTimers();
	});

	it('should handle different OTP lengths', () => {
		const inputRefs4 = createRef<(HTMLInputElement | null)[]>();
		inputRefs4.current = [null, null, null, null, null, null];
		const inputRefs8 = createRef<(HTMLInputElement | null)[]>();
		inputRefs8.current = [null, null, null, null];

		const { rerender: rerender4 } = renderHook(
			({ length }) =>
				useOTPInputFieldEffects({
					length,
					autoFocus: false,
					inputRefs: inputRefs4,
				}),
			{
				initialProps: { length: 6 },
			}
		);

		rerender4({ length: 4 });
		expect(inputRefs4.current.length).toBe(4);

		const { rerender: rerender8 } = renderHook(
			({ length }) =>
				useOTPInputFieldEffects({
					length,
					autoFocus: false,
					inputRefs: inputRefs8,
				}),
			{
				initialProps: { length: 4 },
			}
		);

		rerender8({ length: 8 });
		expect(inputRefs8.current.length).toBe(4); // Should not increase
	});
});
