/**
 * useCarouselKeyboard Tests
 *
 * Tests for the carousel keyboard navigation hook:
 * - Arrow key handling
 * - Event prevention
 * - Handler memoization
 */

import { useCarouselKeyboard } from '@core/ui/media/carousel/hooks/useCarousel.keyboard';
import { createEvent, renderHook } from '@testing-library/react';
import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('useCarouselKeyboard', () => {
	it('should be a function', () => {
		expect(typeof useCarouselKeyboard).toBe('function');
	});

	it('returns a function', () => {
		const { result } = renderHook(() =>
			useCarouselKeyboard(
				() => {},
				() => {}
			)
		);

		expect(typeof result.current).toBe('function');
	});

	it('calls goToPrevious when ArrowLeft is pressed', () => {
		const goToPrevious = vi.fn();
		const goToNext = vi.fn();

		const { result } = renderHook(() => useCarouselKeyboard(goToPrevious, goToNext));

		const event = createEvent.keyDown(document.body, { key: 'ArrowLeft' });
		Object.defineProperty(event, 'preventDefault', {
			value: vi.fn(),
			writable: true,
		});

		result.current(event as unknown as KeyboardEvent<HTMLElement>);

		expect(goToPrevious).toHaveBeenCalledTimes(1);
		expect(goToNext).not.toHaveBeenCalled();
		expect(event.preventDefault).toHaveBeenCalledTimes(1);
	});

	it('calls goToNext when ArrowRight is pressed', () => {
		const goToPrevious = vi.fn();
		const goToNext = vi.fn();

		const { result } = renderHook(() => useCarouselKeyboard(goToPrevious, goToNext));

		const event = createEvent.keyDown(document.body, { key: 'ArrowRight' });
		Object.defineProperty(event, 'preventDefault', {
			value: vi.fn(),
			writable: true,
		});

		result.current(event as unknown as KeyboardEvent<HTMLElement>);

		expect(goToNext).toHaveBeenCalledTimes(1);
		expect(goToPrevious).not.toHaveBeenCalled();
		expect(event.preventDefault).toHaveBeenCalledTimes(1);
	});

	it('does not call handlers for other keys', () => {
		const goToPrevious = vi.fn();
		const goToNext = vi.fn();

		const { result } = renderHook(() => useCarouselKeyboard(goToPrevious, goToNext));

		const event = createEvent.keyDown(document.body, { key: 'Enter' });
		Object.defineProperty(event, 'preventDefault', {
			value: vi.fn(),
			writable: true,
		});

		result.current(event as unknown as KeyboardEvent<HTMLElement>);

		expect(goToPrevious).not.toHaveBeenCalled();
		expect(goToNext).not.toHaveBeenCalled();
		expect(event.preventDefault).not.toHaveBeenCalled();
	});

	it('does not call handlers for Space key', () => {
		const goToPrevious = vi.fn();
		const goToNext = vi.fn();

		const { result } = renderHook(() => useCarouselKeyboard(goToPrevious, goToNext));

		const event = createEvent.keyDown(document.body, { key: ' ' });
		Object.defineProperty(event, 'preventDefault', {
			value: vi.fn(),
			writable: true,
		});

		result.current(event as unknown as KeyboardEvent<HTMLElement>);

		expect(goToPrevious).not.toHaveBeenCalled();
		expect(goToNext).not.toHaveBeenCalled();
	});

	it('updates handler when goToPrevious changes', () => {
		const goToPrevious1 = vi.fn();
		const goToPrevious2 = vi.fn();
		const goToNext = vi.fn();

		const { result, rerender } = renderHook(
			({ goToPrevious }) => useCarouselKeyboard(goToPrevious, goToNext),
			{
				initialProps: { goToPrevious: goToPrevious1 },
			}
		);

		const event = createEvent.keyDown(document.body, { key: 'ArrowLeft' });
		Object.defineProperty(event, 'preventDefault', {
			value: vi.fn(),
			writable: true,
		});

		result.current(event as unknown as KeyboardEvent<HTMLElement>);

		expect(goToPrevious1).toHaveBeenCalledTimes(1);

		rerender({ goToPrevious: goToPrevious2 });

		const event2 = createEvent.keyDown(document.body, { key: 'ArrowLeft' });
		Object.defineProperty(event2, 'preventDefault', {
			value: vi.fn(),
			writable: true,
		});

		result.current(event2 as unknown as KeyboardEvent<HTMLElement>);

		expect(goToPrevious1).toHaveBeenCalledTimes(1);
		expect(goToPrevious2).toHaveBeenCalledTimes(1);
	});

	it('updates handler when goToNext changes', () => {
		const goToPrevious = vi.fn();
		const goToNext1 = vi.fn();
		const goToNext2 = vi.fn();

		const { result, rerender } = renderHook(
			({ goToNext }) => useCarouselKeyboard(goToPrevious, goToNext),
			{
				initialProps: { goToNext: goToNext1 },
			}
		);

		const event = createEvent.keyDown(document.body, { key: 'ArrowRight' });
		Object.defineProperty(event, 'preventDefault', {
			value: vi.fn(),
			writable: true,
		});

		result.current(event as unknown as KeyboardEvent<HTMLElement>);

		expect(goToNext1).toHaveBeenCalledTimes(1);

		rerender({ goToNext: goToNext2 });

		const event2 = createEvent.keyDown(document.body, { key: 'ArrowRight' });
		Object.defineProperty(event2, 'preventDefault', {
			value: vi.fn(),
			writable: true,
		});

		result.current(event2 as unknown as KeyboardEvent<HTMLElement>);

		expect(goToNext1).toHaveBeenCalledTimes(1);
		expect(goToNext2).toHaveBeenCalledTimes(1);
	});
});
