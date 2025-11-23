import { handleMouseMoveLogic } from '@core/ui/utilities/resizable/helpers/useResizable.helpers';
import { describe, expect, it, vi } from 'vitest';

// Helper functions
function createMockContainer(): HTMLDivElement {
	const container = document.createElement('div');
	container.getBoundingClientRect = vi.fn(() => ({
		width: 200,
		height: 300,
		top: 0,
		left: 0,
		right: 200,
		bottom: 300,
		x: 0,
		y: 0,
		toJSON: vi.fn(),
	})) as unknown as () => DOMRect;
	document.body.append(container);
	return container;
}

function createMockMouseEvent(clientX: number, clientY: number): MouseEvent {
	return {
		clientX,
		clientY,
	} as MouseEvent;
}

interface TestParams {
	direction: 'horizontal' | 'vertical' | 'both';
	minSize: number;
	maxSize: number | undefined;
	startPos: number;
	startSize: number;
	clientX: number;
	clientY: number;
}

function executeResizeTest(params: TestParams) {
	const container = createMockContainer();
	const onResize = vi.fn();
	const mockEvent = createMockMouseEvent(params.clientX, params.clientY);

	handleMouseMoveLogic({
		container,
		event: mockEvent,
		direction: params.direction,
		minSize: params.minSize,
		maxSize: params.maxSize,
		onResize,
		startPos: params.startPos,
		startSize: params.startSize,
	});

	return { container, onResize };
}

describe('useResizable.helpers - handleMouseMoveLogic - horizontal direction', () => {
	it('calculates, constrains, and applies size for horizontal direction', () => {
		const { container, onResize } = executeResizeTest({
			direction: 'horizontal',
			minSize: 50,
			maxSize: 500,
			startPos: 200,
			startSize: 150,
			clientX: 250,
			clientY: 100,
		});

		// Expected: 150 + (250 - 200) = 200, within bounds
		expect(container.style.width).toBe('200px');
		expect(onResize).toHaveBeenCalledWith(200);
		expect(onResize).toHaveBeenCalledTimes(1);

		container.remove();
	});
});

describe('useResizable.helpers - handleMouseMoveLogic - constraints', () => {
	it('applies minSize constraint when calculated size is too small', () => {
		const { container, onResize } = executeResizeTest({
			direction: 'horizontal',
			minSize: 100,
			maxSize: 500,
			startPos: 200,
			startSize: 150,
			clientX: 100,
			clientY: 200,
		});

		// Expected: 150 + (100 - 200) = 50, but minSize is 100
		expect(container.style.width).toBe('100px');
		expect(onResize).toHaveBeenCalledWith(100);

		container.remove();
	});

	it('applies maxSize constraint when calculated size is too large', () => {
		const { container, onResize } = executeResizeTest({
			direction: 'horizontal',
			minSize: 50,
			maxSize: 400,
			startPos: 200,
			startSize: 300,
			clientX: 600,
			clientY: 200,
		});

		// Expected: 300 + (600 - 200) = 700, but maxSize is 400
		expect(container.style.width).toBe('400px');
		expect(onResize).toHaveBeenCalledWith(400);

		container.remove();
	});
});

describe('useResizable.helpers - handleMouseMoveLogic - other directions', () => {
	it('works with vertical direction', () => {
		const { container, onResize } = executeResizeTest({
			direction: 'vertical',
			minSize: 50,
			maxSize: 500,
			startPos: 300,
			startSize: 200,
			clientX: 100,
			clientY: 350,
		});

		// Expected: 200 + (350 - 300) = 250
		expect(container.style.height).toBe('250px');
		expect(onResize).toHaveBeenCalledWith(250);

		container.remove();
	});

	it('works with both direction', () => {
		const { container, onResize } = executeResizeTest({
			direction: 'both',
			minSize: 50,
			maxSize: 500,
			startPos: 300,
			startSize: 200,
			clientX: 400,
			clientY: 500,
		});

		// Expected: 200 + (400 - 300) = 300
		expect(container.style.width).toBe('300px');
		expect(container.style.height).toBe('300px');
		expect(onResize).toHaveBeenCalledWith(300);

		container.remove();
	});
});

describe('useResizable.helpers - handleMouseMoveLogic - edge cases', () => {
	it('handles undefined maxSize', () => {
		const { container, onResize } = executeResizeTest({
			direction: 'horizontal',
			minSize: 50,
			maxSize: undefined,
			startPos: 200,
			startSize: 300,
			clientX: 1000,
			clientY: 200,
		});

		// Expected: 300 + (1000 - 200) = 1100, no max constraint
		expect(container.style.width).toBe('1100px');
		expect(onResize).toHaveBeenCalledWith(1100);

		container.remove();
	});
});
