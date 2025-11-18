import { useEffect, useState } from 'react';

const DEFAULT_EVENTS = ['pointerdown', 'keydown', 'mousemove', 'touchstart'] as const;

export interface UseDeferredActivationOptions {
	readonly timeout?: number;
	readonly events?: readonly string[];
	readonly triggerOnVisibilityHidden?: boolean;
}

/**
 * Returns true once the user has interacted with the page or an optional timeout elapses.
 * Useful for deferring non-critical UI or scripts until the page is interactive.
 */
export function useDeferredActivation({
	timeout = 1500,
	events = DEFAULT_EVENTS,
	triggerOnVisibilityHidden = false,
}: UseDeferredActivationOptions = {}): boolean {
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		if (isReady) {
			return;
		}

		if (typeof globalThis.addEventListener !== 'function') {
			setIsReady(true);
			return;
		}

		let activated = false;
		const doc = globalThis.document;
		let timeoutId: ReturnType<typeof globalThis.setTimeout> | null = null;

		function cleanup() {
			for (const eventName of events) {
				globalThis.removeEventListener?.(eventName, activate);
			}

			if (timeoutId !== null) {
				globalThis.clearTimeout(timeoutId);
			}

			if (triggerOnVisibilityHidden) {
				doc?.removeEventListener('visibilitychange', handleVisibilityChange);
			}
		}

		function activate() {
			if (activated) {
				return;
			}
			activated = true;
			cleanup();
			setIsReady(true);
		}

		function handleVisibilityChange() {
			if (doc?.visibilityState === 'hidden') {
				activate();
			}
		}

		if (timeout > 0) {
			timeoutId = globalThis.setTimeout(activate, timeout);
		}

		for (const eventName of events) {
			globalThis.addEventListener?.(eventName, activate, { once: true, passive: true });
		}

		if (triggerOnVisibilityHidden) {
			doc?.addEventListener('visibilitychange', handleVisibilityChange, { once: true });

			if (doc?.visibilityState === 'hidden') {
				activate();
			}
		}

		return cleanup;
	}, [events, isReady, timeout, triggerOnVisibilityHidden]);

	return isReady;
}
