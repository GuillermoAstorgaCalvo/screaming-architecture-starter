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
	const supportsEventListeners = typeof globalThis.addEventListener === 'function';
	const documentRef = typeof document === 'undefined' ? null : document;
	const [isReady, setIsReady] = useState(() => !supportsEventListeners);

	useEffect(() => {
		if (isReady || !supportsEventListeners) {
			return;
		}

		return setupDeferredActivation({
			events,
			timeout,
			triggerOnVisibilityHidden,
			documentRef,
			onActivate: () => setIsReady(true),
		});
	}, [documentRef, events, isReady, supportsEventListeners, timeout, triggerOnVisibilityHidden]);

	return isReady;
}

interface DeferredActivationOptions {
	readonly events: readonly string[];
	readonly timeout: number;
	readonly triggerOnVisibilityHidden: boolean;
	readonly documentRef: Document | null;
	readonly onActivate: () => void;
}

function setupDeferredActivation({
	events,
	timeout,
	triggerOnVisibilityHidden,
	documentRef,
	onActivate,
}: DeferredActivationOptions) {
	let activated = false;
	let timeoutId: ReturnType<typeof globalThis.setTimeout> | null = null;

	function cleanup() {
		for (const eventName of events) {
			globalThis.removeEventListener(eventName, activate);
		}

		if (timeoutId !== null) {
			globalThis.clearTimeout(timeoutId);
		}

		if (triggerOnVisibilityHidden && documentRef) {
			documentRef.removeEventListener('visibilitychange', handleVisibilityChange);
		}
	}

	function activate() {
		if (activated) {
			return;
		}
		activated = true;
		cleanup();
		onActivate();
	}

	function handleVisibilityChange() {
		if (documentRef?.visibilityState === 'hidden') {
			activate();
		}
	}

	if (timeout > 0) {
		timeoutId = globalThis.setTimeout(activate, timeout);
	}

	for (const eventName of events) {
		globalThis.addEventListener(eventName, activate, { once: true, passive: true });
	}

	if (triggerOnVisibilityHidden && documentRef) {
		documentRef.addEventListener('visibilitychange', handleVisibilityChange, { once: true });

		if (documentRef.visibilityState === 'hidden') {
			activate();
		}
	}

	return cleanup;
}
