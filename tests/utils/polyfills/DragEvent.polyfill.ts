/**
 * Polyfill DragEvent for jsdom (not implemented by default)
 *
 * This polyfill provides a minimal implementation of DragEvent
 * for testing environments that don't support it natively.
 */

class MockDragEvent extends MouseEvent {
	dataTransfer: DataTransfer | null;

	constructor(type: string, eventInitDict: DragEventInit = {}) {
		super(type, eventInitDict);
		this.dataTransfer = eventInitDict.dataTransfer ?? new (globalThis.DataTransfer as any)();
	}
}

/**
 * Setup DragEvent polyfill if not available
 */
export function setupDragEventPolyfill(): void {
	if (globalThis.DragEvent === undefined) {
		Object.defineProperty(globalThis, 'DragEvent', {
			value: MockDragEvent,
			writable: true,
		});
	}
}
