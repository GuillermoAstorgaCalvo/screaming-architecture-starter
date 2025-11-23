/**
 * Tests for useResizeEffect hook
 *
 * Tests the useResizeEffect hook:
 * - Effect dependencies
 * - Event listener setup
 * - Style changes
 * - Cleanup function
 */

import { useResizeEffect } from '@core/ui/utilities/splitter/hooks/useSplitter.handlers.effects';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
	// Reset document.body styles
	document.body.style.cursor = '';
	document.body.style.userSelect = '';
	// Clear all event listeners
	vi.clearAllMocks();
});

describe('useResizeEffect - Effect Setup', () => {
	it('adds event listeners when isResizing is true', () => {
		const handleMouseMove = vi.fn();
		const handleMouseUp = vi.fn();
		const handlers = { handleMouseMove, handleMouseUp };

		const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

		renderHook(() => useResizeEffect(true, handlers, 'horizontal'));

		expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', handleMouseMove);
		expect(addEventListenerSpy).toHaveBeenCalledWith('mouseup', handleMouseUp);
	});

	it('sets cursor style for horizontal orientation', () => {
		const handlers = {
			handleMouseMove: vi.fn(),
			handleMouseUp: vi.fn(),
		};

		renderHook(() => useResizeEffect(true, handlers, 'horizontal'));

		expect(document.body.style.cursor).toBe('ew-resize');
	});

	it('sets cursor style for vertical orientation', () => {
		const handlers = {
			handleMouseMove: vi.fn(),
			handleMouseUp: vi.fn(),
		};

		renderHook(() => useResizeEffect(true, handlers, 'vertical'));

		expect(document.body.style.cursor).toBe('ns-resize');
	});

	it('sets userSelect to none when resizing', () => {
		const handlers = {
			handleMouseMove: vi.fn(),
			handleMouseUp: vi.fn(),
		};

		renderHook(() => useResizeEffect(true, handlers, 'horizontal'));

		expect(document.body.style.userSelect).toBe('none');
	});

	it('does not add event listeners when isResizing is false', () => {
		const handleMouseMove = vi.fn();
		const handleMouseUp = vi.fn();
		const handlers = { handleMouseMove, handleMouseUp };

		const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

		renderHook(() => useResizeEffect(false, handlers, 'horizontal'));

		expect(addEventListenerSpy).not.toHaveBeenCalled();
	});
});

describe('useResizeEffect - Cleanup', () => {
	it('removes event listeners on cleanup', () => {
		const handleMouseMove = vi.fn();
		const handleMouseUp = vi.fn();
		const handlers = { handleMouseMove, handleMouseUp };

		const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

		const { unmount } = renderHook(() => useResizeEffect(true, handlers, 'horizontal'));

		unmount();

		expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', handleMouseMove);
		expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', handleMouseUp);
	});

	it('resets cursor style on cleanup', () => {
		const handlers = {
			handleMouseMove: vi.fn(),
			handleMouseUp: vi.fn(),
		};

		const { unmount } = renderHook(() => useResizeEffect(true, handlers, 'horizontal'));

		expect(document.body.style.cursor).toBe('ew-resize');

		unmount();

		expect(document.body.style.cursor).toBe('');
	});

	it('resets userSelect style on cleanup', () => {
		const handlers = {
			handleMouseMove: vi.fn(),
			handleMouseUp: vi.fn(),
		};

		const { unmount } = renderHook(() => useResizeEffect(true, handlers, 'horizontal'));

		expect(document.body.style.userSelect).toBe('none');

		unmount();

		expect(document.body.style.userSelect).toBe('');
	});

	it('cleans up when isResizing changes from true to false', () => {
		const handleMouseMove = vi.fn();
		const handleMouseUp = vi.fn();
		const handlers = { handleMouseMove, handleMouseUp };

		const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

		const { rerender } = renderHook(
			({ isResizing }) => useResizeEffect(isResizing, handlers, 'horizontal'),
			{ initialProps: { isResizing: true } }
		);

		expect(document.body.style.cursor).toBe('ew-resize');

		rerender({ isResizing: false });

		expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', handleMouseMove);
		expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', handleMouseUp);
		expect(document.body.style.cursor).toBe('');
		expect(document.body.style.userSelect).toBe('');
	});
});

describe('useResizeEffect - Effect Dependencies', () => {
	it('re-runs effect when isResizing changes', () => {
		const handleMouseMove1 = vi.fn();
		const handleMouseUp1 = vi.fn();
		const handlers1 = { handleMouseMove: handleMouseMove1, handleMouseUp: handleMouseUp1 };

		const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

		const { rerender } = renderHook(
			({ isResizing, handlers }) => useResizeEffect(isResizing, handlers, 'horizontal'),
			{ initialProps: { isResizing: false, handlers: handlers1 } }
		);

		expect(addEventListenerSpy).not.toHaveBeenCalled();

		const handleMouseMove2 = vi.fn();
		const handleMouseUp2 = vi.fn();
		const handlers2 = { handleMouseMove: handleMouseMove2, handleMouseUp: handleMouseUp2 };

		rerender({ isResizing: true, handlers: handlers2 });

		expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', handleMouseMove2);
		expect(addEventListenerSpy).toHaveBeenCalledWith('mouseup', handleMouseUp2);
	});

	it('re-runs effect when orientation changes', () => {
		const handlers = {
			handleMouseMove: vi.fn(),
			handleMouseUp: vi.fn(),
		};

		const { rerender } = renderHook(
			({ orientation }: { orientation: 'horizontal' | 'vertical' }) =>
				useResizeEffect(true, handlers, orientation),
			{ initialProps: { orientation: 'horizontal' } }
		);

		expect(document.body.style.cursor).toBe('ew-resize');

		rerender({ orientation: 'vertical' });

		expect(document.body.style.cursor).toBe('ns-resize');
	});

	it('re-runs effect when handlers change', () => {
		const handleMouseMove1 = vi.fn();
		const handleMouseUp1 = vi.fn();
		const handlers1 = { handleMouseMove: handleMouseMove1, handleMouseUp: handleMouseUp1 };

		const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
		const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

		const { rerender } = renderHook(
			({ handlers }) => useResizeEffect(true, handlers, 'horizontal'),
			{ initialProps: { handlers: handlers1 } }
		);

		expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', handleMouseMove1);
		expect(addEventListenerSpy).toHaveBeenCalledWith('mouseup', handleMouseUp1);

		const handleMouseMove2 = vi.fn();
		const handleMouseUp2 = vi.fn();
		const handlers2 = { handleMouseMove: handleMouseMove2, handleMouseUp: handleMouseUp2 };

		rerender({ handlers: handlers2 });

		// Should remove old listeners and add new ones
		expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', handleMouseMove1);
		expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', handleMouseUp1);
		expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', handleMouseMove2);
		expect(addEventListenerSpy).toHaveBeenCalledWith('mouseup', handleMouseUp2);
	});
});
