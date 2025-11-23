/**
 * useSheetSetup Tests
 *
 * Tests for the useSheetSetup hook:
 * - Hook initialization
 * - Ref creation
 * - Overlay click handling
 * - Escape key handling integration
 * - Body overflow management
 */

import { useSheetSetup } from '@core/ui/overlays/sheet/hooks/useSheetSetup';
import { fireEvent, renderHook } from '@testing-library/react';
import type { MouseEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('useSheetSetup', () => {
	it('should be a function', () => {
		expect(typeof useSheetSetup).toBe('function');
	});

	it('returns sheetRef and handleOverlayClick', () => {
		const onClose = vi.fn();
		const { result } = renderHook(() => useSheetSetup(true, true, onClose));

		expect(result.current).toHaveProperty('sheetRef');
		expect(result.current).toHaveProperty('handleOverlayClick');
		expect(result.current.sheetRef).toBeDefined();
		expect(result.current.handleOverlayClick).toBeDefined();
	});

	it('creates a ref object', () => {
		const onClose = vi.fn();
		const { result } = renderHook(() => useSheetSetup(true, true, onClose));

		expect(result.current.sheetRef).toHaveProperty('current');
		expect(result.current.sheetRef.current).toBeNull();
	});

	it('calls onClose when overlay is clicked and closeOnOverlayClick is true', () => {
		const onClose = vi.fn();
		const { result } = renderHook(() => useSheetSetup(true, true, onClose));

		const mockEvent = {
			target: document.createElement('div'),
			currentTarget: document.createElement('div'),
		} as unknown as MouseEvent<HTMLDivElement>;

		// Set target and currentTarget to be the same to simulate overlay click
		Object.defineProperty(mockEvent, 'target', {
			writable: true,
			value: mockEvent.currentTarget,
		});

		result.current.handleOverlayClick(mockEvent, true);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('does not call onClose when overlay is clicked and closeOnOverlayClick is false', () => {
		const onClose = vi.fn();
		const { result } = renderHook(() => useSheetSetup(true, true, onClose));

		const mockEvent = {
			target: document.createElement('div'),
			currentTarget: document.createElement('div'),
		} as unknown as MouseEvent<HTMLDivElement>;

		Object.defineProperty(mockEvent, 'target', {
			writable: true,
			value: mockEvent.currentTarget,
		});

		result.current.handleOverlayClick(mockEvent, false);

		expect(onClose).not.toHaveBeenCalled();
	});

	it('does not call onClose when click is on child element', () => {
		const onClose = vi.fn();
		const { result } = renderHook(() => useSheetSetup(true, true, onClose));

		const childElement = document.createElement('div');
		const parentElement = document.createElement('div');
		parentElement.append(childElement);

		const mockEvent = {
			target: childElement,
			currentTarget: parentElement,
		} as unknown as MouseEvent<HTMLDivElement>;

		result.current.handleOverlayClick(mockEvent, true);

		expect(onClose).not.toHaveBeenCalled();
	});

	it('handles escape key when closeOnEscape is true', () => {
		const onClose = vi.fn();
		renderHook(() => useSheetSetup(true, true, onClose));

		fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('does not handle escape key when closeOnEscape is false', () => {
		const onClose = vi.fn();
		renderHook(() => useSheetSetup(true, false, onClose));

		fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

		expect(onClose).not.toHaveBeenCalled();
	});

	it('manages body overflow when sheet is open', () => {
		renderHook(() => useSheetSetup(true, true, vi.fn()));

		expect(document.body.style.overflow).toBe('hidden');
	});

	it('restores body overflow when sheet is closed', () => {
		const { rerender } = renderHook(({ isOpen }) => useSheetSetup(isOpen, true, vi.fn()), {
			initialProps: { isOpen: true },
		});

		expect(document.body.style.overflow).toBe('hidden');

		rerender({ isOpen: false });

		expect(document.body.style.overflow).toBe('');
	});

	it('updates when isOpen changes', () => {
		const onClose = vi.fn();
		const { rerender } = renderHook(
			({ isOpen, closeOnEscape }) => useSheetSetup(isOpen, closeOnEscape, onClose),
			{
				initialProps: { isOpen: false, closeOnEscape: true },
			}
		);

		expect(document.body.style.overflow).toBe('');

		rerender({ isOpen: true, closeOnEscape: true });

		expect(document.body.style.overflow).toBe('hidden');

		rerender({ isOpen: false, closeOnEscape: true });

		expect(document.body.style.overflow).toBe('');
	});

	it('updates when closeOnEscape changes', () => {
		const onClose = vi.fn();
		const { rerender } = renderHook(
			({ isOpen, closeOnEscape }) => useSheetSetup(isOpen, closeOnEscape, onClose),
			{
				initialProps: { isOpen: true, closeOnEscape: true },
			}
		);

		fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
		expect(onClose).toHaveBeenCalledTimes(1);

		onClose.mockClear();

		rerender({ isOpen: true, closeOnEscape: false });

		fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
		expect(onClose).not.toHaveBeenCalled();
	});

	it('updates when onClose changes', () => {
		const onClose1 = vi.fn();
		const { rerender } = renderHook(({ onClose }) => useSheetSetup(true, true, onClose), {
			initialProps: { onClose: onClose1 },
		});

		fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
		expect(onClose1).toHaveBeenCalledTimes(1);

		const onClose2 = vi.fn();
		rerender({ onClose: onClose2 });

		fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
		expect(onClose2).toHaveBeenCalledTimes(1);
		expect(onClose1).toHaveBeenCalledTimes(1); // Should not be called again
	});
});
