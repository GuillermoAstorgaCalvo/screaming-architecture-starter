import { vi } from 'vitest';

// Helper functions for tests
export function createMockRect(top: number, left: number, width: number, height: number): DOMRect {
	return {
		top,
		left,
		right: left + width,
		bottom: top + height,
		width,
		height,
		x: left,
		y: top,
		toJSON: vi.fn(),
	};
}

export function setupWindowViewport(): void {
	Object.defineProperty(globalThis.window, 'innerHeight', {
		configurable: true,
		value: 800,
	});
	Object.defineProperty(globalThis.window, 'innerWidth', {
		configurable: true,
		value: 1200,
	});
}
