import { initializeResizeStart } from '@core/ui/utilities/resizable/helpers/useResizable.helpers';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

function createMockContainer(width: number, height: number): HTMLDivElement {
	const container = document.createElement('div');
	container.getBoundingClientRect = vi.fn(() => ({
		width,
		height,
		top: 0,
		left: 0,
		right: width,
		bottom: height,
		x: 0,
		y: 0,
		toJSON: vi.fn(),
	})) as unknown as () => DOMRect;
	return container;
}

function createMockEvent(clientX: number, clientY: number): ReactMouseEvent<HTMLButtonElement> {
	return {
		clientX,
		clientY,
	} as unknown as ReactMouseEvent<HTMLButtonElement>;
}

function createRefs(startPos: number, startSize: number) {
	return {
		startPosRef: { current: startPos },
		startSizeRef: { current: startSize },
	};
}

interface ResizeStartTestOptions {
	direction: 'horizontal' | 'vertical' | 'both';
	clientX: number;
	clientY: number;
	expectedPos: number;
	expectedSize: number;
	initialPos?: number;
	initialSize?: number;
}

function executeResizeStartTest(options: ResizeStartTestOptions) {
	const {
		direction,
		clientX,
		clientY,
		expectedPos,
		expectedSize,
		initialPos = 0,
		initialSize = 0,
	} = options;
	const container = createMockContainer(200, 300);
	const { startPosRef, startSizeRef } = createRefs(initialPos, initialSize);
	const mockEvent = createMockEvent(clientX, clientY);

	initializeResizeStart({
		event: mockEvent,
		container,
		direction,
		startPosRef,
		startSizeRef,
	});

	expect(startPosRef.current).toBe(expectedPos);
	expect(startSizeRef.current).toBe(expectedSize);
}

describe('useResizable.helpers - initializeResizeStart', () => {
	describe('horizontal direction', () => {
		it('initializes horizontal resize with clientX and width', () => {
			executeResizeStartTest({
				direction: 'horizontal',
				clientX: 150,
				clientY: 200,
				expectedPos: 150,
				expectedSize: 200,
			});
		});
	});

	describe('vertical direction', () => {
		it('initializes vertical resize with clientY and height', () => {
			executeResizeStartTest({
				direction: 'vertical',
				clientX: 100,
				clientY: 250,
				expectedPos: 250,
				expectedSize: 300,
			});
		});
	});

	describe('both direction', () => {
		it('initializes both direction with clientX and width', () => {
			executeResizeStartTest({
				direction: 'both',
				clientX: 180,
				clientY: 280,
				expectedPos: 180,
				expectedSize: 200,
			});
		});
	});

	describe('ref overwrite', () => {
		it('overwrites existing ref values', () => {
			executeResizeStartTest({
				direction: 'horizontal',
				clientX: 100,
				clientY: 200,
				expectedPos: 100,
				expectedSize: 200,
				initialPos: 999,
				initialSize: 888,
			});
		});
	});
});
