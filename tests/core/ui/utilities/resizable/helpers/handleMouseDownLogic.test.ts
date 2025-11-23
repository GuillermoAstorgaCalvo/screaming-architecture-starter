import { handleMouseDownLogic } from '@core/ui/utilities/resizable/helpers/useResizable.helpers';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

function createTestContainer() {
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

function createMockEvent(clientX: number, clientY: number) {
	return {
		clientX,
		clientY,
		preventDefault: vi.fn(),
	} as unknown as ReactMouseEvent<HTMLButtonElement>;
}

function createTestRefs() {
	return {
		startPosRef: { current: 0 },
		startSizeRef: { current: 0 },
		setIsResizing: vi.fn(),
	};
}

function assertMouseDownBehavior({
	event,
	setIsResizing,
	startPosRef,
	startSizeRef,
	expectedPos,
	expectedSize,
}: {
	event: ReactMouseEvent<HTMLButtonElement>;
	setIsResizing: ReturnType<typeof vi.fn>;
	startPosRef: { current: number };
	startSizeRef: { current: number };
	expectedPos: number;
	expectedSize: number;
}) {
	expect(event.preventDefault).toHaveBeenCalled();
	expect(setIsResizing).toHaveBeenCalledWith(true);
	expect(startPosRef.current).toBe(expectedPos);
	expect(startSizeRef.current).toBe(expectedSize);
}

function runMouseDownTest(
	direction: 'horizontal' | 'vertical' | 'both',
	clientX: number,
	clientY: number,
	expectedPos: number,
	expectedSize: number
) {
	const container = createTestContainer();
	const { startPosRef, startSizeRef, setIsResizing } = createTestRefs();
	const mockEvent = createMockEvent(clientX, clientY);

	handleMouseDownLogic({
		container,
		event: mockEvent,
		direction,
		setIsResizing,
		startPosRef,
		startSizeRef,
	});

	assertMouseDownBehavior({
		event: mockEvent,
		setIsResizing,
		startPosRef,
		startSizeRef,
		expectedPos,
		expectedSize,
	});

	container.remove();
}

describe('useResizable.helpers - handleMouseDownLogic', () => {
	describe('direction tests', () => {
		it('prevents default, sets isResizing, and initializes resize start for horizontal', () => {
			runMouseDownTest('horizontal', 150, 200, 150, 200);
		});

		it('prevents default, sets isResizing, and initializes resize start for vertical', () => {
			runMouseDownTest('vertical', 100, 250, 250, 300);
		});

		it('prevents default, sets isResizing, and initializes resize start for both', () => {
			runMouseDownTest('both', 180, 280, 180, 200);
		});
	});
});
