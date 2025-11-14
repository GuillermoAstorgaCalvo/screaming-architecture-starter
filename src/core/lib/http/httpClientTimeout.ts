/**
 * HTTP Client Timeout Utilities
 *
 * Utilities for managing request timeouts with AbortController.
 */

/**
 * Result of createTimeoutController - includes both controller and timeout ID for cleanup
 */
export interface TimeoutController {
	controller: AbortController;
	timeoutId: ReturnType<typeof setTimeout>;
}

/**
 * Create an AbortController for timeout support
 * Returns both the controller and timeout ID so the timeout can be cleared if request completes early
 */
export function createTimeoutController(
	timeout?: number
): { controller: AbortController; timeoutId: ReturnType<typeof setTimeout> } | null {
	if (timeout) {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => {
			controller.abort();
		}, timeout);
		return { controller, timeoutId };
	}
	return null;
}
