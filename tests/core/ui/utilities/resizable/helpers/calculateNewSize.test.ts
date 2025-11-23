import { calculateNewSize } from '@core/ui/utilities/resizable/helpers/useResizable.helpers';
import { describe, expect, it } from 'vitest';

function createMockEvent(clientX: number, clientY: number): MouseEvent {
	return {
		clientX,
		clientY,
	} as MouseEvent;
}

function testHorizontalDirection() {
	const mockEvent = createMockEvent(250, 100);
	const result = calculateNewSize({
		event: mockEvent,
		direction: 'horizontal',
		startPos: 200,
		startSize: 150,
	});
	expect(result).toBe(200); // 150 + (250 - 200)
}

function testVerticalDirection() {
	const mockEvent = createMockEvent(100, 350);
	const result = calculateNewSize({
		event: mockEvent,
		direction: 'vertical',
		startPos: 300,
		startSize: 200,
	});
	expect(result).toBe(250); // 200 + (350 - 300)
}

function testBothDirection() {
	const mockEvent = createMockEvent(400, 500);
	const result = calculateNewSize({
		event: mockEvent,
		direction: 'both',
		startPos: 300,
		startSize: 100,
	});
	expect(result).toBe(200); // 100 + (400 - 300)
}

function testNegativeDelta() {
	const mockEvent = createMockEvent(150, 250);
	const horizontalResult = calculateNewSize({
		event: mockEvent,
		direction: 'horizontal',
		startPos: 200,
		startSize: 300,
	});
	const verticalResult = calculateNewSize({
		event: mockEvent,
		direction: 'vertical',
		startPos: 300,
		startSize: 400,
	});
	expect(horizontalResult).toBe(250); // 300 + (150 - 200)
	expect(verticalResult).toBe(350); // 400 + (250 - 300)
}

function testZeroDelta() {
	const mockEvent = createMockEvent(200, 300);
	const result = calculateNewSize({
		event: mockEvent,
		direction: 'horizontal',
		startPos: 200,
		startSize: 150,
	});
	expect(result).toBe(150); // 150 + (200 - 200)
}

describe('useResizable.helpers - calculateNewSize', () => {
	describe('direction tests', () => {
		it('calculates new size for horizontal direction using clientX', testHorizontalDirection);

		it('calculates new size for vertical direction using clientY', testVerticalDirection);

		it('calculates new size for both direction using clientX', testBothDirection);
	});

	describe('edge cases', () => {
		it('handles negative delta (resizing left/up)', testNegativeDelta);

		it('handles zero delta (no movement)', testZeroDelta);
	});
});
