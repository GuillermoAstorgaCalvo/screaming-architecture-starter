/**
 * Polyfill DataTransfer for jsdom (not implemented by default)
 *
 * This polyfill provides a minimal implementation of DataTransfer
 * for testing environments that don't support it natively.
 */

import { vi } from 'vitest';

class MockDataTransfer {
	dropEffect: string = 'none';
	effectAllowed: string = 'all';
	files: FileList;
	items: DataTransferItemList;
	types: readonly string[] = [];

	constructor() {
		// Create a mock FileList
		const fileList: File[] = [];
		this.files = Object.assign(fileList, {
			item: (index: number) => fileList[index] ?? null,
			length: 0,
		}) as FileList;

		// Create a mock DataTransferItemList
		const items: DataTransferItem[] = [];
		this.items = Object.assign(items, {
			add: (data: string | File): DataTransferItem | null => {
				if (typeof data === 'string') {
					const item = {
						kind: 'string',
						type: 'text/plain',
						getAsString: vi.fn(),
						getAsFile: vi.fn(() => null),
						webkitGetAsEntry: vi.fn(() => null),
					} as DataTransferItem;
					items.push(item);
					return item;
				} else {
					fileList.push(data);
					Object.defineProperty(this.files, 'length', { value: fileList.length });
					const item = {
						kind: 'file',
						type: data.type,
						getAsString: vi.fn(),
						getAsFile: vi.fn(() => data),
						webkitGetAsEntry: vi.fn(() => null),
					} as DataTransferItem;
					items.push(item);
					return item;
				}
			},
			clear: vi.fn(() => {
				items.length = 0;
				fileList.length = 0;
				Object.defineProperty(this.files, 'length', { value: 0 });
			}),
			remove: vi.fn((index: number) => {
				items.splice(index, 1);
			}),
			item: (index: number) => items[index] ?? null,
			length: 0,
		}) as DataTransferItemList;
	}

	getData(_format: string): string {
		return '';
	}

	setData(_format: string, _data: string): void {
		// Mock implementation
	}

	clearData(_format?: string): void {
		// Mock implementation
	}

	setDragImage(_image: Element, _x: number, _y: number): void {
		// Mock implementation
	}
}

/**
 * Setup DataTransfer polyfill if not available
 */
export function setupDataTransferPolyfill(): void {
	if (globalThis.DataTransfer === undefined) {
		Object.defineProperty(globalThis, 'DataTransfer', {
			value: MockDataTransfer,
			writable: true,
		});
	}
}
