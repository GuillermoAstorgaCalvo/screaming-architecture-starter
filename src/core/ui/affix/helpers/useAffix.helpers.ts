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

	switch (position) {
		case 'top': {
			return scrollPosition >= initialPosition - threshold;
		}
		case 'bottom': {
			const viewportHeight = globalThis.window.innerHeight;
			const elementBottom = initialPosition + rect.height;
			const viewportBottom = scrollPosition + viewportHeight;
			return viewportBottom >= elementBottom + threshold;
		}
		case 'left': {
			return scrollPosition >= initialPosition - threshold;
		}
		case 'right': {
			const viewportWidth = globalThis.window.innerWidth;
			const elementRight = initialPosition + rect.width;
			const viewportRight = scrollPosition + viewportWidth;
			return viewportRight >= elementRight + threshold;
		}
		default: {
			return false;
		}
	}
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
