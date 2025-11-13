import {
	buildLoopAnimationStyle,
	calculateDuplicateCount,
	createDuplicatedContentFactory,
} from '@core/ui/media/marquee/helpers/useMarqueeHelpers';
import { useMarquee } from '@core/ui/media/marquee/hooks/useMarquee';
import { type ReactNode, type RefObject, useEffect, useMemo, useRef, useState } from 'react';

interface UseDuplicateCountOptions {
	readonly loop: boolean;
	readonly providedDuplicateCount: number | undefined;
	readonly containerRef: RefObject<HTMLDivElement | null>;
	readonly measureRef: RefObject<HTMLDivElement | null>;
}

/**
 * Hook to manage duplicate count calculation with ResizeObserver
 */
export function useDuplicateCount(options: Readonly<UseDuplicateCountOptions>): number {
	const { loop, providedDuplicateCount, containerRef, measureRef } = options;
	const [duplicateCount, setDuplicateCount] = useState(providedDuplicateCount ?? 2);

	useEffect(() => {
		if (!loop || providedDuplicateCount !== undefined) {
			return;
		}

		const measureElement = measureRef.current;
		const container = containerRef.current;
		if (measureElement === null || container === null) {
			return;
		}

		const resizeObserver = new ResizeObserver(() => {
			const containerWidth = container.clientWidth;
			const contentWidth = measureElement.scrollWidth;
			const calculated = calculateDuplicateCount(containerWidth, contentWidth);
			setDuplicateCount(calculated);
		});

		resizeObserver.observe(container);
		resizeObserver.observe(measureElement);

		return () => {
			resizeObserver.disconnect();
		};
	}, [loop, providedDuplicateCount, containerRef, measureRef]);

	return duplicateCount;
}

interface UseMarqueeAnimationOptions {
	readonly direction: 'left' | 'right';
	readonly speed: number;
	readonly pauseOnHover: boolean;
	readonly loop: boolean;
}

/**
 * Hook to manage marquee animation state
 */
export function useMarqueeAnimation(options: Readonly<UseMarqueeAnimationOptions>) {
	const { direction, speed, pauseOnHover, loop } = options;
	const { contentRef, animationStyle, isPaused } = useMarquee({
		direction,
		speed,
		pauseOnHover,
		loop,
	});

	const loopAnimationStyle = buildLoopAnimationStyle(loop, direction, isPaused);

	return {
		contentRef,
		animationStyle,
		loopAnimationStyle,
	};
}

interface UseMarqueeContentOptions {
	readonly children: ReactNode;
	readonly loop: boolean;
	readonly providedDuplicateCount: number | undefined;
	readonly containerRef: RefObject<HTMLDivElement | null>;
}

/**
 * Hook to manage marquee content duplication
 */
export function useMarqueeContent(options: Readonly<UseMarqueeContentOptions>) {
	const { children, loop, providedDuplicateCount, containerRef } = options;
	const measureRef = useRef<HTMLDivElement>(null);
	const duplicateCount = useDuplicateCount({
		loop,
		providedDuplicateCount,
		containerRef,
		measureRef,
	});

	const duplicatedContent = useMemo(() => {
		if (!loop) {
			return [children];
		}
		const items = createDuplicatedContentFactory(children, duplicateCount);
		return items.map(({ key, children: child }) => (
			<div key={key} className="inline-block shrink-0">
				{child}
			</div>
		));
	}, [children, loop, duplicateCount]);

	return {
		duplicatedContent,
		measureRef,
	};
}

interface UseMarqueeStateOptions {
	readonly children: ReactNode;
	readonly direction: 'left' | 'right';
	readonly speed: number;
	readonly pauseOnHover: boolean;
	readonly loop: boolean;
	readonly providedDuplicateCount: number | undefined;
	readonly containerRef: RefObject<HTMLDivElement | null>;
}

/**
 * Hook to manage marquee state and calculations
 */
export function useMarqueeState(options: Readonly<UseMarqueeStateOptions>) {
	const { children, direction, speed, pauseOnHover, loop, providedDuplicateCount, containerRef } =
		options;

	const { contentRef, animationStyle, loopAnimationStyle } = useMarqueeAnimation({
		direction,
		speed,
		pauseOnHover,
		loop,
	});

	const { duplicatedContent, measureRef } = useMarqueeContent({
		children,
		loop,
		providedDuplicateCount,
		containerRef,
	});

	return {
		contentRef,
		animationStyle,
		loopAnimationStyle,
		duplicatedContent,
		measureRef,
	};
}
