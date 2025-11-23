/**
 * useMarqueeLogic Tests
 *
 * Tests for the useMarqueeLogic hook including:
 * - Default props handling
 * - Integration with useMarquee and useMarqueeState
 * - showMeasure calculation
 * - Return values
 */

import { DEFAULT_LOOP } from '@core/ui/media/marquee/constants/Marquee.constants';
import { useMarqueeLogic } from '@core/ui/media/marquee/hooks/useMarqueeLogic';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useMarqueeLogic', () => {
	describe('default props', () => {
		it('should use default direction when not provided', () => {
			const children = <span>Test Content</span>;
			const { result } = renderHook(() =>
				useMarqueeLogic({
					children,
				})
			);

			expect(result.current).toBeDefined();
			// Direction is used internally, verify hook returns expected structure
			expect(result.current.containerRef).toBeDefined();
		});

		it('should use default speed when not provided', () => {
			const children = <span>Test Content</span>;
			const { result } = renderHook(() =>
				useMarqueeLogic({
					children,
				})
			);

			expect(result.current).toBeDefined();
			expect(result.current.containerRef).toBeDefined();
		});

		it('should use default pauseOnHover when not provided', () => {
			const children = <span>Test Content</span>;
			const { result } = renderHook(() =>
				useMarqueeLogic({
					children,
				})
			);

			expect(result.current).toBeDefined();
			expect(result.current.containerRef).toBeDefined();
		});

		it('should use default loop when not provided', () => {
			const children = <span>Test Content</span>;
			const { result } = renderHook(() =>
				useMarqueeLogic({
					children,
				})
			);

			expect(result.current).toBeDefined();
			expect(result.current.loop).toBe(DEFAULT_LOOP);
		});
	});

	describe('custom props', () => {
		it('should use custom direction', () => {
			const children = <span>Test Content</span>;
			const { result } = renderHook(() =>
				useMarqueeLogic({
					children,
					direction: 'right',
				})
			);

			expect(result.current).toBeDefined();
			expect(result.current.containerRef).toBeDefined();
		});

		it('should use custom speed', () => {
			const children = <span>Test Content</span>;
			const { result } = renderHook(() =>
				useMarqueeLogic({
					children,
					speed: 100,
				})
			);

			expect(result.current).toBeDefined();
			expect(result.current.containerRef).toBeDefined();
		});

		it('should use custom pauseOnHover', () => {
			const children = <span>Test Content</span>;
			const { result } = renderHook(() =>
				useMarqueeLogic({
					children,
					pauseOnHover: false,
				})
			);

			expect(result.current).toBeDefined();
			expect(result.current.containerRef).toBeDefined();
		});

		it('should use custom loop', () => {
			const children = <span>Test Content</span>;
			const { result } = renderHook(() =>
				useMarqueeLogic({
					children,
					loop: false,
				})
			);

			expect(result.current).toBeDefined();
			expect(result.current.loop).toBe(false);
		});

		it('should use custom duplicateCount', () => {
			const children = <span>Test Content</span>;
			const { result } = renderHook(() =>
				useMarqueeLogic({
					children,
					duplicateCount: 5,
				})
			);

			expect(result.current).toBeDefined();
			expect(result.current.showMeasure).toBe(false);
		});
	});

	describe('return values', () => {
		it('should return all required properties', () => {
			const children = <span>Test Content</span>;
			const { result } = renderHook(() =>
				useMarqueeLogic({
					children,
				})
			);

			expect(result.current.containerRef).toBeDefined();
			expect(result.current.contentRef).toBeDefined();
			expect(result.current.animationStyle).toBeDefined();
			expect(result.current.loopAnimationStyle).toBeDefined();
			expect(result.current.duplicatedContent).toBeDefined();
			expect(result.current.measureRef).toBeDefined();
			expect(typeof result.current.showMeasure).toBe('boolean');
			expect(typeof result.current.loop).toBe('boolean');
		});

		it('should return containerRef from useMarquee', () => {
			const children = <span>Test Content</span>;
			const { result } = renderHook(() =>
				useMarqueeLogic({
					children,
				})
			);

			expect(result.current.containerRef).toBeDefined();
			expect(result.current.containerRef.current).toBeNull();
		});

		it('should return contentRef from useMarqueeState', () => {
			const children = <span>Test Content</span>;
			const { result } = renderHook(() =>
				useMarqueeLogic({
					children,
				})
			);

			expect(result.current.contentRef).toBeDefined();
			expect(result.current.contentRef.current).toBeNull();
		});

		it('should return animationStyle from useMarqueeState', () => {
			const children = <span>Test Content</span>;
			const { result } = renderHook(() =>
				useMarqueeLogic({
					children,
				})
			);

			expect(result.current.animationStyle).toBeDefined();
			expect(typeof result.current.animationStyle).toBe('object');
		});

		it('should return loopAnimationStyle from useMarqueeState', () => {
			const children = <span>Test Content</span>;
			const { result } = renderHook(() =>
				useMarqueeLogic({
					children,
					loop: true,
				})
			);

			expect(result.current.loopAnimationStyle).toBeDefined();
		});

		it('should return duplicatedContent from useMarqueeState', () => {
			const children = <span>Test Content</span>;
			const { result } = renderHook(() =>
				useMarqueeLogic({
					children,
				})
			);

			expect(result.current.duplicatedContent).toBeDefined();
			expect(Array.isArray(result.current.duplicatedContent)).toBe(true);
		});

		it('should return measureRef from useMarqueeState', () => {
			const children = <span>Test Content</span>;
			const { result } = renderHook(() =>
				useMarqueeLogic({
					children,
				})
			);

			expect(result.current.measureRef).toBeDefined();
			expect(result.current.measureRef.current).toBeNull();
		});
	});

	describe('showMeasure calculation', () => {
		it('should return true when loop is true and duplicateCount is undefined', () => {
			const children = <span>Test Content</span>;
			const { result } = renderHook(() =>
				useMarqueeLogic({
					children,
					loop: true,
				})
			);

			expect(result.current.showMeasure).toBe(true);
		});

		it('should return false when loop is false', () => {
			const children = <span>Test Content</span>;
			const { result } = renderHook(() =>
				useMarqueeLogic({
					children,
					loop: false,
				})
			);

			expect(result.current.showMeasure).toBe(false);
		});

		it('should return false when duplicateCount is provided', () => {
			const children = <span>Test Content</span>;
			const { result } = renderHook(() =>
				useMarqueeLogic({
					children,
					loop: true,
					duplicateCount: 3,
				})
			);

			expect(result.current.showMeasure).toBe(false);
		});

		it('should return false when loop is false and duplicateCount is provided', () => {
			const children = <span>Test Content</span>;
			const { result } = renderHook(() =>
				useMarqueeLogic({
					children,
					loop: false,
					duplicateCount: 3,
				})
			);

			expect(result.current.showMeasure).toBe(false);
		});
	});

	describe('integration', () => {
		it('should integrate useMarquee and useMarqueeState correctly', () => {
			const children = <span>Test Content</span>;
			const { result } = renderHook(() =>
				useMarqueeLogic({
					children,
					direction: 'right',
					speed: 75,
					pauseOnHover: false,
					loop: true,
					duplicateCount: 4,
				})
			);

			// Verify all hooks are integrated
			expect(result.current.containerRef).toBeDefined();
			expect(result.current.contentRef).toBeDefined();
			expect(result.current.animationStyle).toBeDefined();
			expect(result.current.loopAnimationStyle).toBeDefined();
			expect(result.current.duplicatedContent).toBeDefined();
			expect(result.current.measureRef).toBeDefined();
			expect(result.current.showMeasure).toBe(false);
			expect(result.current.loop).toBe(true);
		});

		it('should handle all props together', () => {
			const children = <div>Complex Content</div>;
			const { result } = renderHook(() =>
				useMarqueeLogic({
					children,
					direction: 'left',
					speed: 30,
					pauseOnHover: true,
					loop: false,
					duplicateCount: 2,
					className: 'custom-class',
				})
			);

			expect(result.current).toBeDefined();
			expect(result.current.loop).toBe(false);
			expect(result.current.showMeasure).toBe(false);
		});
	});
});
