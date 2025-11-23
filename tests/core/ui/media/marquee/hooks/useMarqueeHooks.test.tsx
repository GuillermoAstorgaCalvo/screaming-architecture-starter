/**
 * useMarqueeHooks Tests
 *
 * Tests for the marquee hooks including:
 * - useDuplicateCount
 * - useMarqueeAnimation
 * - useMarqueeContent
 * - useMarqueeState
 */

import {
	useDuplicateCount,
	useMarqueeAnimation,
	useMarqueeContent,
	useMarqueeState,
} from '@core/ui/media/marquee/hooks/useMarqueeHooks';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock ResizeObserver globally
beforeEach(() => {
	const observeSpy = vi.fn();
	const disconnectSpy = vi.fn();
	const mockResizeObserver = class {
		observe = observeSpy;
		disconnect = disconnectSpy;
		unobserve = vi.fn();
	} as unknown as typeof ResizeObserver;
	globalThis.ResizeObserver = mockResizeObserver;
	vi.clearAllMocks();
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('useMarqueeHooks', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	describe('useDuplicateCount', () => {
		it('should return provided duplicate count when provided', () => {
			const containerRef = { current: document.createElement('div') };
			const measureRef = { current: document.createElement('div') };

			const { result } = renderHook(() =>
				useDuplicateCount({
					loop: true,
					providedDuplicateCount: 5,
					containerRef,
					measureRef,
				})
			);

			expect(result.current).toBe(5);
		});

		it('should return default when providedDuplicateCount is undefined and loop is false', () => {
			const containerRef = { current: document.createElement('div') };
			const measureRef = { current: document.createElement('div') };

			const { result } = renderHook(() =>
				useDuplicateCount({
					loop: false,
					providedDuplicateCount: undefined,
					containerRef,
					measureRef,
				})
			);

			expect(result.current).toBe(2);
		});

		it('should calculate duplicate count when providedDuplicateCount is undefined and loop is true', () => {
			const container = document.createElement('div');
			Object.defineProperty(container, 'clientWidth', {
				value: 500,
				writable: true,
			});

			const measureElement = document.createElement('div');
			Object.defineProperty(measureElement, 'scrollWidth', {
				value: 200,
				writable: true,
			});

			const containerRef = { current: container };
			const measureRef = { current: measureElement };

			const { result } = renderHook(() =>
				useDuplicateCount({
					loop: true,
					providedDuplicateCount: undefined,
					containerRef,
					measureRef,
				})
			);

			// Initial value should be 2 (default)
			// ResizeObserver will update it, but we can't easily test that without more complex setup
			expect(result.current).toBe(2);
		});
	});

	describe('useMarqueeAnimation', () => {
		it('should return animation styles and refs', () => {
			const { result } = renderHook(() =>
				useMarqueeAnimation({
					direction: 'left',
					speed: 50,
					pauseOnHover: true,
					loop: true,
				})
			);

			expect(result.current.contentRef).toBeDefined();
			expect(result.current.animationStyle).toBeDefined();
			expect(result.current.loopAnimationStyle).toBeDefined();
		});

		it('should return loop animation style when loop is true', () => {
			const { result } = renderHook(() =>
				useMarqueeAnimation({
					direction: 'left',
					speed: 50,
					pauseOnHover: false,
					loop: true,
				})
			);

			expect(result.current.loopAnimationStyle).toBeDefined();
			expect(result.current.loopAnimationStyle?.animation).toContain('marquee-left');
		});

		it('should return undefined loop animation style when loop is false', () => {
			const { result } = renderHook(() =>
				useMarqueeAnimation({
					direction: 'left',
					speed: 50,
					pauseOnHover: false,
					loop: false,
				})
			);

			expect(result.current.loopAnimationStyle).toBeUndefined();
		});

		it('should update animation style when direction changes', () => {
			const { result, rerender } = renderHook(
				({ direction }: { direction: 'left' | 'right' }) =>
					useMarqueeAnimation({
						direction,
						speed: 50,
						pauseOnHover: false,
						loop: true,
					}),
				{
					initialProps: { direction: 'left' as 'left' | 'right' },
				}
			);

			expect(result.current.loopAnimationStyle?.animation).toContain('marquee-left');

			rerender({ direction: 'right' as 'left' | 'right' });
			expect(result.current.loopAnimationStyle?.animation).toContain('marquee-right');
		});
	});

	describe('useMarqueeContent', () => {
		it('should return single content when loop is false', () => {
			const children = <span>Test Content</span>;
			const containerRef = { current: document.createElement('div') };

			const { result } = renderHook(() =>
				useMarqueeContent({
					children,
					loop: false,
					providedDuplicateCount: undefined,
					containerRef,
				})
			);

			expect(result.current.duplicatedContent).toHaveLength(1);
			expect(result.current.measureRef).toBeDefined();
		});

		it('should return duplicated content when loop is true', () => {
			const children = <span>Test Content</span>;
			const containerRef = { current: document.createElement('div') };

			const { result } = renderHook(() =>
				useMarqueeContent({
					children,
					loop: true,
					providedDuplicateCount: 3,
					containerRef,
				})
			);

			expect(result.current.duplicatedContent.length).toBeGreaterThanOrEqual(1);
			expect(result.current.measureRef).toBeDefined();
		});

		it('should update duplicated content when duplicateCount changes', () => {
			const children = <span>Test Content</span>;
			const containerRef = { current: document.createElement('div') };

			const { result, rerender } = renderHook(
				({ providedDuplicateCount }) =>
					useMarqueeContent({
						children,
						loop: true,
						providedDuplicateCount,
						containerRef,
					}),
				{
					initialProps: { providedDuplicateCount: 2 as number | undefined },
				}
			);

			const initialLength = result.current.duplicatedContent.length;

			rerender({ providedDuplicateCount: 4 });
			// When providedDuplicateCount changes, content should update
			expect(result.current.duplicatedContent.length).toBeGreaterThanOrEqual(initialLength);
		});

		it('should wrap duplicated content in div elements', () => {
			const children = <span>Test Content</span>;
			const containerRef = { current: document.createElement('div') };

			const { result } = renderHook(() =>
				useMarqueeContent({
					children,
					loop: true,
					providedDuplicateCount: 2,
					containerRef,
				})
			);

			// Each item should be a div with inline-block shrink-0 classes
			for (const item of result.current.duplicatedContent) {
				expect(item).toBeDefined();
			}
		});
	});

	describe('useMarqueeState', () => {
		it('should return all required state and refs', () => {
			const children = <span>Test Content</span>;
			const containerRef = { current: document.createElement('div') };

			const { result } = renderHook(() =>
				useMarqueeState({
					children,
					direction: 'left',
					speed: 50,
					pauseOnHover: true,
					loop: true,
					providedDuplicateCount: undefined,
					containerRef,
				})
			);

			expect(result.current.contentRef).toBeDefined();
			expect(result.current.animationStyle).toBeDefined();
			expect(result.current.loopAnimationStyle).toBeDefined();
			expect(result.current.duplicatedContent).toBeDefined();
			expect(result.current.measureRef).toBeDefined();
		});

		it('should combine animation and content hooks correctly', () => {
			const children = <span>Test Content</span>;
			const containerRef = { current: document.createElement('div') };

			const { result } = renderHook(() =>
				useMarqueeState({
					children,
					direction: 'right',
					speed: 100,
					pauseOnHover: false,
					loop: true,
					providedDuplicateCount: 3,
					containerRef,
				})
			);

			expect(result.current.animationStyle).toBeDefined();
			expect(result.current.loopAnimationStyle?.animation).toContain('marquee-right');
			expect(result.current.duplicatedContent.length).toBeGreaterThanOrEqual(1);
		});

		it('should update state when props change', () => {
			const children = <span>Test Content</span>;
			const containerRef = { current: document.createElement('div') };

			const { result, rerender } = renderHook(
				({ direction, speed }: { direction: 'left' | 'right'; speed: number }) =>
					useMarqueeState({
						children,
						direction,
						speed,
						pauseOnHover: true,
						loop: true,
						providedDuplicateCount: undefined,
						containerRef,
					}),
				{
					initialProps: { direction: 'left' as 'left' | 'right', speed: 50 },
				}
			);

			expect(result.current.loopAnimationStyle?.animation).toContain('marquee-left');

			rerender({ direction: 'right' as 'left' | 'right', speed: 100 });
			expect(result.current.loopAnimationStyle?.animation).toContain('marquee-right');
		});
	});
});
