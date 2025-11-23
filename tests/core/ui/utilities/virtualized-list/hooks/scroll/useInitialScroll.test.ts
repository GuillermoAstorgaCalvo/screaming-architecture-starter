/**
 * Tests for useInitialScroll hook
 *
 * Tests initial scroll offset setting
 */

import { useInitialScroll } from '@core/ui/utilities/virtualized-list/hooks/scroll/useInitialScroll';
import { renderHook } from '@testing-library/react';
import { createRef, type RefObject } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function setupTestFixtures() {
	const mockElement = document.createElement('div');
	const parentRef = createRef<HTMLDivElement>();
	parentRef.current = mockElement;
	return { mockElement, parentRef };
}

describe('useInitialScroll - edge cases', () => {
	let mockElement: HTMLDivElement;
	let parentRef: RefObject<HTMLDivElement | null>;

	beforeEach(() => {
		const { mockElement: element, parentRef: ref } = setupTestFixtures();
		mockElement = element;
		parentRef = ref;
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should not set scroll when initialScrollOffset is 0', () => {
		renderHook(() =>
			useInitialScroll({
				initialScrollOffset: 0,
				orientation: 'vertical',
				parentRef,
			})
		);

		expect(mockElement.scrollTop).toBe(0);
		expect(mockElement.scrollLeft).toBe(0);
	});

	it('should not set scroll when parentRef.current is null', () => {
		const nullRef = createRef<HTMLDivElement>();

		renderHook(() =>
			useInitialScroll({
				initialScrollOffset: 100,
				orientation: 'vertical',
				parentRef: nullRef,
			})
		);

		// Should not throw or error
		expect(nullRef.current).toBeNull();
	});

	it('should handle negative initialScrollOffset', () => {
		renderHook(() =>
			useInitialScroll({
				initialScrollOffset: -50,
				orientation: 'vertical',
				parentRef,
			})
		);

		// Should not set scroll (condition is initialScrollOffset > 0)
		expect(mockElement.scrollTop).toBe(0);
	});

	it('should handle very large initialScrollOffset', () => {
		renderHook(() =>
			useInitialScroll({
				initialScrollOffset: 1000000,
				orientation: 'vertical',
				parentRef,
			})
		);

		expect(mockElement.scrollTop).toBe(1000000);
	});
});

describe('useInitialScroll - orientation-specific scroll', () => {
	let mockElement: HTMLDivElement;
	let parentRef: RefObject<HTMLDivElement | null>;

	beforeEach(() => {
		const { mockElement: element, parentRef: ref } = setupTestFixtures();
		mockElement = element;
		parentRef = ref;
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should set scrollTop for vertical orientation', () => {
		renderHook(() =>
			useInitialScroll({
				initialScrollOffset: 150,
				orientation: 'vertical',
				parentRef,
			})
		);

		expect(mockElement.scrollTop).toBe(150);
		expect(mockElement.scrollLeft).toBe(0);
	});

	it('should set scrollLeft for horizontal orientation', () => {
		renderHook(() =>
			useInitialScroll({
				initialScrollOffset: 250,
				orientation: 'horizontal',
				parentRef,
			})
		);

		expect(mockElement.scrollLeft).toBe(250);
		expect(mockElement.scrollTop).toBe(0);
	});
});

describe('useInitialScroll - dynamic updates', () => {
	let mockElement: HTMLDivElement;
	let parentRef: RefObject<HTMLDivElement | null>;

	beforeEach(() => {
		const { mockElement: element, parentRef: ref } = setupTestFixtures();
		mockElement = element;
		parentRef = ref;
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should update scroll when initialScrollOffset changes', () => {
		const { rerender } = renderHook(
			({ initialScrollOffset }) =>
				useInitialScroll({
					initialScrollOffset,
					orientation: 'vertical',
					parentRef,
				}),
			{ initialProps: { initialScrollOffset: 100 } }
		);

		expect(mockElement.scrollTop).toBe(100);

		rerender({ initialScrollOffset: 200 });

		expect(mockElement.scrollTop).toBe(200);
	});

	it('should update scroll when orientation changes', () => {
		type Orientation = 'vertical' | 'horizontal';
		const { rerender } = renderHook(
			(props: { orientation: Orientation }) =>
				useInitialScroll({
					initialScrollOffset: 150,
					orientation: props.orientation,
					parentRef,
				}),
			{ initialProps: { orientation: 'vertical' as Orientation } }
		);

		expect(mockElement.scrollTop).toBe(150);
		expect(mockElement.scrollLeft).toBe(0);

		rerender({ orientation: 'horizontal' as Orientation });

		expect(mockElement.scrollLeft).toBe(150);
		expect(mockElement.scrollTop).toBe(150); // Previous value remains
	});
});
