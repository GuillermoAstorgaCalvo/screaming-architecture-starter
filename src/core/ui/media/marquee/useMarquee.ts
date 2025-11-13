import {
	type CSSProperties,
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';

interface UseMarqueeOptions {
	readonly direction: 'left' | 'right';
	readonly speed: number;
	readonly pauseOnHover: boolean;
	readonly loop: boolean;
}

interface UseMarqueeReturn {
	readonly isPaused: boolean;
	readonly setIsPaused: (paused: boolean) => void;
	readonly containerRef: RefObject<HTMLDivElement | null>;
	readonly contentRef: RefObject<HTMLDivElement | null>;
	readonly animationStyle: CSSProperties;
}

// Approximate milliseconds per frame at 60fps for transform calculations
const MILLISECONDS_PER_FRAME = 16;

/**
 * Updates the marquee animation duration based on content width and speed
 */
function setupDurationObserver(
	contentRef: RefObject<HTMLDivElement | null>,
	containerRef: RefObject<HTMLDivElement | null>,
	speed: number
): () => void {
	const content = contentRef.current;
	const container = containerRef.current;
	if (!content || !container) {
		return () => {};
	}

	const updateDuration = () => {
		const currentContent = contentRef.current;
		const currentContainer = containerRef.current;
		if (!currentContent || !currentContainer) {
			return;
		}

		const contentWidth = currentContent.scrollWidth / 2; // Divide by 2 since we duplicate content
		if (contentWidth === 0) {
			return;
		}

		// Set CSS custom property for animation duration
		// Duration = distance / speed (in seconds)
		const duration = contentWidth / speed;
		currentContainer.style.setProperty('--marquee-duration', `${duration}s`);
	};

	// Initial calculation
	updateDuration();

	// Recalculate on resize
	const resizeObserver = new ResizeObserver(updateDuration);
	resizeObserver.observe(content);
	resizeObserver.observe(container);

	return () => {
		resizeObserver.disconnect();
	};
}

/**
 * Calculates the transform value for non-loop marquee animation
 */
function getTransformValue(direction: 'left' | 'right', speed: number, isPaused: boolean): string {
	if (isPaused) {
		return 'none';
	}
	const sign = direction === 'left' ? '-' : '';
	return `translateX(${sign}${speed / MILLISECONDS_PER_FRAME}px)`;
}

interface AnimationStyleParams {
	readonly loop: boolean;
	readonly direction: 'left' | 'right';
	readonly isPaused: boolean;
	readonly speed: number;
}

/**
 * Builds the animation style based on loop mode and pause state
 */
function buildAnimationStyle(params: Readonly<AnimationStyleParams>): CSSProperties {
	const { loop, direction, isPaused, speed } = params;
	if (loop) {
		return {
			animation: isPaused
				? 'none'
				: `marquee-${direction} var(--marquee-duration, 20s) linear infinite`,
		};
	}
	return {
		transform: getTransformValue(direction, speed, isPaused),
		transition: 'transform 0.1s linear',
	};
}

/**
 * Sets up hover event listeners for pause functionality
 */
function usePauseOnHover(
	containerRef: RefObject<HTMLDivElement | null>,
	pauseOnHover: boolean,
	setIsPaused: (paused: boolean) => void
): void {
	const handleMouseEnter = useCallback(() => {
		if (pauseOnHover) {
			setIsPaused(true);
		}
	}, [pauseOnHover, setIsPaused]);

	const handleMouseLeave = useCallback(() => {
		if (pauseOnHover) {
			setIsPaused(false);
		}
	}, [pauseOnHover, setIsPaused]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container || !pauseOnHover) {
			return;
		}

		container.addEventListener('mouseenter', handleMouseEnter);
		container.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			container.removeEventListener('mouseenter', handleMouseEnter);
			container.removeEventListener('mouseleave', handleMouseLeave);
		};
	}, [pauseOnHover, handleMouseEnter, handleMouseLeave, containerRef]);
}

/**
 * Hook for managing marquee animation state and styles
 */
export function useMarquee({
	direction,
	speed,
	pauseOnHover,
	loop,
}: Readonly<UseMarqueeOptions>): UseMarqueeReturn {
	const [isPaused, setIsPaused] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!loop) {
			return;
		}
		return setupDurationObserver(contentRef, containerRef, speed);
	}, [speed, loop]);

	usePauseOnHover(containerRef, pauseOnHover, setIsPaused);

	const animationStyle = buildAnimationStyle({ loop, direction, isPaused, speed });

	return {
		isPaused,
		setIsPaused,
		containerRef,
		contentRef,
		animationStyle,
	};
}
