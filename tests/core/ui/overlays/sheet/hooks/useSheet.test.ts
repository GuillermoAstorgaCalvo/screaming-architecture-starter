/**
 * useSheet Tests
 *
 * Tests for sheet hooks:
 * - useSheetId: ID generation
 * - useBodyOverflow: body overflow management
 */

import { useBodyOverflow, useSheetId } from '@core/ui/overlays/sheet/hooks/useSheet';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useSheetId', () => {
	it('should be a function', () => {
		expect(typeof useSheetId).toBe('function');
	});

	it('returns provided sheetId when given', () => {
		const { result } = renderHook(() => useSheetId('custom-sheet-id'));

		expect(result.current).toBe('custom-sheet-id');
	});

	it('generates ID with sheet- prefix when sheetId is undefined', () => {
		const { result } = renderHook(() => useSheetId(undefined));

		expect(result.current).toBeTruthy();
		expect(result.current).toContain('sheet-');
	});

	it('generates unique IDs for multiple calls', () => {
		const { result: result1 } = renderHook(() => useSheetId(undefined));
		const { result: result2 } = renderHook(() => useSheetId(undefined));

		expect(result1.current).not.toBe(result2.current);
		expect(result1.current).toContain('sheet-');
		expect(result2.current).toContain('sheet-');
	});

	it('returns same ID when same sheetId is provided', () => {
		const { result: result1 } = renderHook(() => useSheetId('same-id'));
		const { result: result2 } = renderHook(() => useSheetId('same-id'));

		expect(result1.current).toBe('same-id');
		expect(result2.current).toBe('same-id');
	});
});

describe('useBodyOverflow', () => {
	it('should be a function', () => {
		expect(typeof useBodyOverflow).toBe('function');
	});

	it('sets body overflow to hidden when sheet is open', () => {
		renderHook(() => useBodyOverflow(true));

		expect(document.body.style.overflow).toBe('hidden');
	});

	it('sets body overflow to empty string when sheet is closed', () => {
		renderHook(() => useBodyOverflow(false));

		expect(document.body.style.overflow).toBe('');
	});

	it('updates body overflow when isOpen changes', () => {
		const { rerender } = renderHook(({ isOpen }) => useBodyOverflow(isOpen), {
			initialProps: { isOpen: false },
		});

		expect(document.body.style.overflow).toBe('');

		rerender({ isOpen: true });
		expect(document.body.style.overflow).toBe('hidden');

		rerender({ isOpen: false });
		expect(document.body.style.overflow).toBe('');
	});

	it('restores body overflow on unmount', () => {
		const { unmount } = renderHook(() => useBodyOverflow(true));

		expect(document.body.style.overflow).toBe('hidden');

		unmount();

		expect(document.body.style.overflow).toBe('');
	});

	it('handles multiple sheets opening and closing', () => {
		const { unmount: unmount1 } = renderHook(() => useBodyOverflow(true));
		expect(document.body.style.overflow).toBe('hidden');

		const { unmount: unmount2 } = renderHook(() => useBodyOverflow(true));
		expect(document.body.style.overflow).toBe('hidden');

		unmount1();
		// Each hook manages overflow independently, so unmounting resets it
		expect(document.body.style.overflow).toBe('');

		// Re-render to test second hook
		renderHook(() => useBodyOverflow(true));
		expect(document.body.style.overflow).toBe('hidden');

		unmount2();
		// Now should be empty
		expect(document.body.style.overflow).toBe('');
	});
});
