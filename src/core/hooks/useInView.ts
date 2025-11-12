/**
 * useInView - Hook for scroll-triggered animations
 *
 * A wrapper around Intersection Observer API that provides a simple interface
 * for detecting when elements enter or leave the viewport. Useful for triggering
 * animations when elements scroll into view.
 *
 * @example
 * ```tsx
 * const { ref, inView } = useInView();
 *
 * return (
 *   <motion.div
 *     ref={ref}
 *     initial={{ opacity: 0, y: 20 }}
 *     animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
 *   >
 *     Content that animates when scrolled into view
 *   </motion.div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * const { ref, inView } = useInView({
 *   threshold: 0.5,
 *   rootMargin: '100px',
 *   triggerOnce: true,
 * });
 *
 * return (
 *   <motion.div
 *     ref={ref}
 *     variants={fadeVariants}
 *     initial="hidden"
 *     animate={inView ? 'visible' : 'hidden'}
 *   >
 *     Content that animates once when 50% visible
 *   </motion.div>
 * );
 * ```
 */

import { useEffect, useRef, useState } from 'react';

/**
 * Options for useInView hook
 */
export interface UseInViewOptions {
	/** Threshold for intersection (0-1) @default 0 */
	threshold?: number | number[];
	/** Root margin for intersection observer @default '0px' */
	rootMargin?: string;
	/** Root element to use as viewport @default null (uses viewport) */
	root?: Element | null;
	/** Whether to trigger only once @default false */
	triggerOnce?: boolean;
	/** Whether the observer is enabled @default true */
	enabled?: boolean;
}

/**
 * Return type for useInView hook
 */
export interface UseInViewReturn {
	/** Ref to attach to the element to observe */
	ref: (node: Element | null) => void;
	/** Whether the element is currently in view */
	inView: boolean;
	/** The IntersectionObserverEntry (if available) */
	entry?: IntersectionObserverEntry | undefined;
}

/**
 * Setup intersection observer effect
 */
function setupObserver(
	element: Element,
	observerRef: { current: IntersectionObserver | null },
	config: {
		threshold: number | number[];
		rootMargin: string;
		root: Element | null;
		triggerOnce: boolean;
		hasTriggeredRef: { current: boolean };
		setEntry: (entry: IntersectionObserverEntry) => void;
		setInView: (inView: boolean) => void;
	}
) {
	if (observerRef.current) {
		observerRef.current.disconnect();
	}

	const handleIntersect = (entries: IntersectionObserverEntry[]) => {
		const [intersectionEntry] = entries;
		if (!intersectionEntry) {
			return;
		}

		config.setEntry(intersectionEntry);
		if (intersectionEntry.isIntersecting) {
			config.setInView(true);
			if (config.triggerOnce) {
				config.hasTriggeredRef.current = true;
			}
		} else if (!config.triggerOnce) {
			config.setInView(false);
		}
	};

	const observer = new IntersectionObserver(handleIntersect, {
		threshold: config.threshold,
		rootMargin: config.rootMargin,
		root: config.root,
	});

	observerRef.current = observer;
	observer.observe(element);

	return () => {
		observerRef.current?.disconnect();
		observerRef.current = null;
	};
}

/**
 * Hook for detecting when elements enter or leave the viewport
 *
 * Uses Intersection Observer API to efficiently detect visibility changes.
 * Perfect for scroll-triggered animations with Framer Motion.
 */
export function useInView(options: Readonly<UseInViewOptions> = {}): UseInViewReturn {
	const {
		threshold = 0,
		rootMargin = '0px',
		root = null,
		triggerOnce = false,
		enabled = true,
	} = options;

	const [inView, setInView] = useState(false);
	const [entry, setEntry] = useState<IntersectionObserverEntry | undefined>(undefined);
	const elementRef = useRef<Element | null>(null);
	const observerRef = useRef<IntersectionObserver | null>(null);
	const hasTriggeredRef = useRef(false);

	const ref = (node: Element | null) => {
		elementRef.current = node;
	};

	useEffect(() => {
		if (!enabled) {
			return;
		}

		const element = elementRef.current;
		if (!element || (triggerOnce && hasTriggeredRef.current)) {
			return;
		}

		return setupObserver(element, observerRef, {
			threshold,
			rootMargin,
			root,
			triggerOnce,
			hasTriggeredRef,
			setEntry,
			setInView,
		});
	}, [threshold, rootMargin, root, triggerOnce, enabled]);

	return { ref, inView, entry };
}
