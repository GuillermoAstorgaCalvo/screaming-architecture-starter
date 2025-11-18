import { useDeferredActivation } from '@core/hooks/useDeferredActivation';
import { LazyMotionProvider } from '@core/ui/utilities/motion/components/MotionProvider.lazy';
import type { ReactNode } from 'react';

interface DeferredMotionProviderProps {
	children: ReactNode;
}

/**
 * Defers mounting the MotionProvider (and therefore loading framer-motion)
 * until after the first user interaction or after a short timeout fallback.
 *
 * This keeps the animation bundle off the critical rendering path while still
 * enabling transitions once the user starts interacting with the page.
 */
export function DeferredMotionProvider({ children }: Readonly<DeferredMotionProviderProps>) {
	const isReady = useDeferredActivation({ timeout: 0, triggerOnVisibilityHidden: true });

	if (!isReady) {
		return children;
	}

	return <LazyMotionProvider reducedMotion="user">{children}</LazyMotionProvider>;
}
