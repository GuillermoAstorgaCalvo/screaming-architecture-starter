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

import { useCallback, useEffect, useRef, useState } from 'react';

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

interface MutableRef<T> {
	current: T;
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
		if (intersectionEntry === undefined) {
			return;
		}

		config.setEntry(intersectionEntry);
		if (intersectionEntry.isIntersecting) {
			config.setInView(true);
			if (config.triggerOnce) {
				config.hasTriggeredRef.current = true;
			}
			return;
		}

		if (config.triggerOnce) {
			return;
		}

		config.setInView(false);
	};

	const observer = createObserver(handleIntersect, {
		threshold: config.threshold,
		rootMargin: config.rootMargin,
		root: config.root,
	});

	if (observer === null) {
		return;
	}

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
	const resolvedOptions = {
		threshold: options.threshold ?? 0,
		rootMargin: options.rootMargin ?? '0px',
		root: options.root ?? null,
		triggerOnce: options.triggerOnce ?? false,
		enabled: options.enabled ?? true,
	};

	return useObserverLifecycle(resolvedOptions);
}

interface ObserverLifecycleOptions extends Required<Omit<UseInViewOptions, 'root'>> {
	root: Element | null;
}

function useObserverLifecycle(options: ObserverLifecycleOptions): UseInViewReturn {
	const { threshold, rootMargin, root, triggerOnce, enabled } = options;
	const [inView, setInView] = useState(false);
	const [entry, setEntry] = useState<IntersectionObserverEntry | undefined>(undefined);
	const observerRef = useRef<IntersectionObserver | null>(null);
	const cleanupRef = useRef<(() => void) | null>(null);
	const targetRef = useRef<Element | null>(null);
	const hasTriggeredRef = useRef(false);

	const reconnectObserver = useCallback(() => {
		cleanupRef.current?.();
		cleanupRef.current = null;

		const element = targetRef.current;

		if (element === null) {
			return;
		}

		if (triggerOnce && hasTriggeredRef.current) {
			return;
		}

		if (enabled) {
			const cleanup = setupObserver(element, observerRef, {
				threshold,
				rootMargin,
				root,
				triggerOnce,
				hasTriggeredRef,
				setEntry,
				setInView,
			});

			if (cleanup) {
				cleanupRef.current = cleanup;
			}
		}
	}, [enabled, threshold, rootMargin, root, triggerOnce]);

	const ref = useCallback(
		(node: Element | null) => {
			targetRef.current = node;

			if (node === null) {
				cleanupRef.current?.();
				cleanupRef.current = null;
				observerRef.current = null;
				return;
			}

			reconnectObserver();
		},
		[reconnectObserver]
	);

	useObserverCleanup({ reconnectObserver, cleanupRef, observerRef });

	return { ref, inView, entry };
}

function useObserverCleanup({
	reconnectObserver,
	cleanupRef,
	observerRef,
}: {
	reconnectObserver: () => void;
	cleanupRef: MutableRef<(() => void) | null>;
	observerRef: MutableRef<IntersectionObserver | null>;
}) {
	useEffect(() => {
		reconnectObserver();

		return () => {
			cleanupRef.current?.();
			cleanupRef.current = null;
			observerRef.current = null;
		};
	}, [reconnectObserver, cleanupRef, observerRef]);
}

type ObserverFactory = typeof IntersectionObserver;

function isConstructor(
	fn: unknown
): fn is new (...args: ConstructorParameters<ObserverFactory>) => IntersectionObserver {
	return typeof fn === 'function' && Boolean((fn as ObserverFactory).prototype);
}

function createObserver(
	callback: IntersectionObserverCallback,
	options: IntersectionObserverInit
): IntersectionObserver | null {
	const globalObject = getGlobalObject();
	const Observer = globalObject?.IntersectionObserver;

	if (Observer) {
		if (isConstructor(Observer)) {
			try {
				return new Observer(callback, options);
			} catch (error) {
				if (error instanceof TypeError) {
					// Fallback to handling mocked implementations that behave like factories
				} else {
					throw error;
				}
			}
		}

		const factory = Observer as unknown as (
			cb: IntersectionObserverCallback,
			init: IntersectionObserverInit
		) => IntersectionObserver;

		return factory(callback, options);
	}

	return null;
}

function getGlobalObject(): typeof globalThis | undefined {
	if (typeof globalThis === 'undefined') {
		return undefined;
	}

	return globalThis;
}
