/**
 * Tests for useScrollHandler hook
 *
 * Tests scroll event handling and onScrollChange callback
 */

import { useScrollHandler } from '@core/ui/utilities/virtualized-list/hooks/scroll/useScrollHandler';
import { renderHook } from '@testing-library/react';
import { createRef, type RefObject } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type Orientation = 'vertical' | 'horizontal';

function renderScrollHandler(props: {
	onScrollChange?: ((value: number) => void) | undefined;
	orientation: Orientation;
	parentRef: RefObject<HTMLDivElement | null>;
}) {
	return renderHook(() =>
		useScrollHandler({
			...(props.onScrollChange !== undefined && { onScrollChange: props.onScrollChange }),
			orientation: props.orientation,
			parentRef: props.parentRef,
		})
	);
}

function getScrollHandler(mockElement: HTMLDivElement): (() => void) | undefined {
	const [, scrollHandler] = (mockElement.addEventListener as ReturnType<typeof vi.fn>).mock
		.calls[0] as [string, () => void, { passive: boolean }];
	return scrollHandler;
}

function triggerScrollHandler(mockElement: HTMLDivElement): void {
	const handler = getScrollHandler(mockElement);
	if (handler) {
		handler();
	}
}

function setupTestElement() {
	const mockElement = document.createElement('div');
	const parentRef = createRef<HTMLDivElement>();
	parentRef.current = mockElement;
	vi.spyOn(mockElement, 'addEventListener');
	vi.spyOn(mockElement, 'removeEventListener');
	return { mockElement, parentRef };
}

describe('useScrollHandler - event listener registration', () => {
	let mockElement: HTMLDivElement;
	let parentRef: RefObject<HTMLDivElement | null>;

	beforeEach(() => {
		const { mockElement: element, parentRef: ref } = setupTestElement();
		mockElement = element;
		parentRef = ref;
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should not add event listener when parentRef.current is null', () => {
		const nullRef = createRef<HTMLDivElement>();
		const onScrollChange = vi.fn();

		renderScrollHandler({
			onScrollChange,
			orientation: 'vertical',
			parentRef: nullRef,
		});

		expect(mockElement.addEventListener).not.toHaveBeenCalled();
	});

	it('should not add event listener when onScrollChange is undefined', () => {
		renderScrollHandler({
			onScrollChange: undefined,
			orientation: 'vertical',
			parentRef,
		});

		expect(mockElement.addEventListener).not.toHaveBeenCalled();
	});

	it('should add scroll event listener for vertical orientation', () => {
		const onScrollChange = vi.fn();

		renderScrollHandler({
			onScrollChange,
			orientation: 'vertical',
			parentRef,
		});

		expect(mockElement.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), {
			passive: true,
		});
	});

	it('should add scroll event listener for horizontal orientation', () => {
		const onScrollChange = vi.fn();

		renderScrollHandler({
			onScrollChange,
			orientation: 'horizontal',
			parentRef,
		});

		expect(mockElement.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), {
			passive: true,
		});
	});
});

describe('useScrollHandler - scroll event handling', () => {
	let mockElement: HTMLDivElement;
	let parentRef: RefObject<HTMLDivElement | null>;

	beforeEach(() => {
		const { mockElement: element, parentRef: ref } = setupTestElement();
		mockElement = element;
		parentRef = ref;
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should call onScrollChange with scrollTop for vertical orientation', () => {
		const onScrollChange = vi.fn();
		mockElement.scrollTop = 100;

		renderScrollHandler({
			onScrollChange,
			orientation: 'vertical',
			parentRef,
		});

		triggerScrollHandler(mockElement);

		expect(onScrollChange).toHaveBeenCalledWith(100);
	});

	it('should call onScrollChange with scrollLeft for horizontal orientation', () => {
		const onScrollChange = vi.fn();
		mockElement.scrollLeft = 200;

		renderScrollHandler({
			onScrollChange,
			orientation: 'horizontal',
			parentRef,
		});

		triggerScrollHandler(mockElement);

		expect(onScrollChange).toHaveBeenCalledWith(200);
	});
});

describe('useScrollHandler - cleanup', () => {
	let mockElement: HTMLDivElement;
	let parentRef: RefObject<HTMLDivElement | null>;

	beforeEach(() => {
		const { mockElement: element, parentRef: ref } = setupTestElement();
		mockElement = element;
		parentRef = ref;
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should remove event listener on unmount', () => {
		const onScrollChange = vi.fn();

		const { unmount } = renderScrollHandler({
			onScrollChange,
			orientation: 'vertical',
			parentRef,
		});

		unmount();

		expect(mockElement.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
	});
});

describe('useScrollHandler - updates', () => {
	let mockElement: HTMLDivElement;
	let parentRef: RefObject<HTMLDivElement | null>;

	beforeEach(() => {
		const { mockElement: element, parentRef: ref } = setupTestElement();
		mockElement = element;
		parentRef = ref;
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should update event listener when onScrollChange changes', () => {
		const onScrollChange1 = vi.fn();
		const onScrollChange2 = vi.fn();

		const { rerender } = renderHook(
			({ onScrollChange }) =>
				useScrollHandler({
					onScrollChange,
					orientation: 'vertical',
					parentRef,
				}),
			{ initialProps: { onScrollChange: onScrollChange1 } }
		);

		const firstHandler = getScrollHandler(mockElement);

		rerender({ onScrollChange: onScrollChange2 });

		if (firstHandler) {
			expect(mockElement.removeEventListener).toHaveBeenCalledWith('scroll', firstHandler);
		}
		expect(mockElement.addEventListener).toHaveBeenCalledTimes(2);
	});

	it('should update event listener when orientation changes', () => {
		const onScrollChange = vi.fn();

		const { rerender } = renderHook(
			(props: { orientation: Orientation }) =>
				useScrollHandler({
					onScrollChange,
					orientation: props.orientation,
					parentRef,
				}),
			{ initialProps: { orientation: 'vertical' as Orientation } }
		);

		const firstHandler = getScrollHandler(mockElement);

		rerender({ orientation: 'horizontal' as Orientation });

		if (firstHandler) {
			expect(mockElement.removeEventListener).toHaveBeenCalledWith('scroll', firstHandler);
		}
		expect(mockElement.addEventListener).toHaveBeenCalledTimes(2);
	});
});
