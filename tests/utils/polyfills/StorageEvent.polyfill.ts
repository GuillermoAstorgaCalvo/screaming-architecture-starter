/**
 * Polyfill StorageEvent for jsdom (not implemented by default)
 *
 * This polyfill provides a minimal implementation of StorageEvent
 * for testing environments that don't support it natively.
 */

class MockStorageEvent extends Event {
	key: string | null;
	newValue: string | null;
	oldValue: string | null;
	storageArea: Storage | null;
	url: string;

	constructor(type: string, eventInitDict: StorageEventInit = {}) {
		super(type, eventInitDict);
		this.key = eventInitDict.key ?? null;
		this.newValue = eventInitDict.newValue ?? null;
		this.oldValue = eventInitDict.oldValue ?? null;
		this.storageArea = eventInitDict.storageArea ?? globalThis.window?.sessionStorage ?? null;
		this.url = eventInitDict.url ?? '';
	}
}

/**
 * Setup StorageEvent polyfill if not available
 */
export function setupStorageEventPolyfill(): void {
	if (globalThis.StorageEvent === undefined) {
		Object.defineProperty(globalThis, 'StorageEvent', {
			value: MockStorageEvent,
			writable: true,
		});
	}
}
