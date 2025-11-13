export type AffixPosition = 'top' | 'bottom' | 'left' | 'right';

const THROTTLE_DELAY_MS = 16; // ~60fps

interface PositionStateParams {
	readonly position: AffixPosition;
	readonly scrollPosition: number;
	readonly initialPosition: number;
	readonly threshold: number;
	readonly rect: DOMRect;
}

export function getScrollY(container: HTMLElement | null | undefined): number {
	if (container) {
		return container.scrollTop;
	}
	return globalThis.window.scrollY || document.documentElement.scrollTop;
}

export function getScrollX(container: HTMLElement | null | undefined): number {
	if (container) {
		return container.scrollLeft;
	}
	return globalThis.window.scrollX || document.documentElement.scrollLeft;
}

export function getInitialPosition(
	element: HTMLElement,
	position: AffixPosition,
	container: HTMLElement | null | undefined
): number {
	const rect = element.getBoundingClientRect();
	const isVertical = position === 'top' || position === 'bottom';

	if (isVertical) {
		const scrollTop = container ? container.scrollTop : getScrollY(container);
		return rect.top + scrollTop;
	}

	const scrollLeft = container ? container.scrollLeft : getScrollX(container);
	return rect.left + scrollLeft;
}

export function calculatePositionState(params: PositionStateParams): boolean {
	const { position, scrollPosition, initialPosition, threshold, rect } = params;
	const isVertical = position === 'top' || position === 'bottom';
	const shouldStickBefore = position === 'top' || position === 'left';

	if (shouldStickBefore) {
		return scrollPosition >= initialPosition - threshold;
	}

	const viewportSize = isVertical ? globalThis.window.innerHeight : globalThis.window.innerWidth;
	const elementSize = isVertical ? rect.height : rect.width;
	return scrollPosition + viewportSize >= initialPosition + elementSize + threshold;
}

export function createThrottledHandler(handler: () => void, delay: number): () => void {
	let rafId: number | null = null;
	let lastScrollTime = 0;

	return (): void => {
		const now = Date.now();
		if (now - lastScrollTime >= delay) {
			lastScrollTime = now;
			handler();
		} else {
			if (rafId !== null) {
				cancelAnimationFrame(rafId);
			}
			rafId = requestAnimationFrame(() => {
				handler();
			});
		}
	};
}

export function setupScrollListeners(
	container: HTMLElement | null | undefined,
	handler: () => void
): () => void {
	const throttledHandler = createThrottledHandler(handler, THROTTLE_DELAY_MS);

	if (container) {
		container.addEventListener('scroll', throttledHandler, { passive: true });
		return () => {
			container.removeEventListener('scroll', throttledHandler);
		};
	}

	globalThis.window.addEventListener('scroll', throttledHandler, { passive: true });
	globalThis.window.addEventListener('resize', throttledHandler, { passive: true });

	return () => {
		globalThis.window.removeEventListener('scroll', throttledHandler);
		globalThis.window.removeEventListener('resize', throttledHandler);
	};
}
