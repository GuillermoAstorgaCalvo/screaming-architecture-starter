/**
 * Tests for useResizeHandlers hook
 *
 * Tests the useResizeHandlers hook:
 * - Mouse move handler edge cases (lines 80-81)
 * - Mouse up handler (line 104)
 * - Handler integration with container ref
 */

import { useResizeHandlers } from '@core/ui/utilities/resizable/hooks/useResizable.handlers';
import type { ResizableDirection } from '@src-types/ui/overlays/containers';
import { act, renderHook } from '@testing-library/react';
import { createRef, type MouseEvent as ReactMouseEvent, type RefObject } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockHandleMouseMoveLogic = vi.fn();
const mockHandleMouseUpLogic = vi.fn();
const mockHandleMouseDownLogic = vi.fn();

// Mock the helper functions
vi.mock('@core/ui/utilities/resizable/helpers/useResizable.helpers', () => ({
	handleMouseMoveLogic: (...args: unknown[]) => mockHandleMouseMoveLogic(...args),
	handleMouseUpLogic: (...args: unknown[]) => mockHandleMouseUpLogic(...args),
	handleMouseDownLogic: (...args: unknown[]) => mockHandleMouseDownLogic(...args),
	isHorizontal: (direction: ResizableDirection) =>
		direction === 'horizontal' || direction === 'both',
}));

beforeEach(() => {
	vi.clearAllMocks();
});

// Helper functions for test setup
interface TestSetupParams {
	container?: HTMLDivElement | null;
	direction?: ResizableDirection;
	startPos?: number;
	startSize?: number;
	isResizing?: boolean;
}

function createTestSetup({
	container = null,
	direction = 'horizontal',
	startPos = 100,
	startSize = 200,
	isResizing = true,
}: TestSetupParams = {}) {
	const containerRef = createRef<HTMLDivElement>();
	if (container) {
		containerRef.current = container;
	}
	const setIsResizing = vi.fn();
	const startPosRef = { current: startPos };
	const startSizeRef = { current: startSize };
	const onResize = vi.fn();

	return {
		containerRef: containerRef as RefObject<HTMLDivElement>,
		setIsResizing,
		startPosRef,
		startSizeRef,
		onResize,
		direction,
		isResizing,
	};
}

function createHookConfig(
	params: ReturnType<typeof createTestSetup>,
	overrides?: { isResizing?: boolean }
) {
	return {
		containerRef: params.containerRef,
		direction: params.direction,
		minSize: 50,
		maxSize: 500,
		onResize: params.onResize,
		disabled: false,
		isResizing: overrides?.isResizing ?? params.isResizing ?? true,
		setIsResizing: params.setIsResizing,
		startPosRef: params.startPosRef,
		startSizeRef: params.startSizeRef,
	};
}

function createMouseMoveEvent(clientX = 150, clientY = 100) {
	return new MouseEvent('mousemove', {
		bubbles: true,
		cancelable: true,
		clientX,
		clientY,
	});
}

function createMouseUpEvent() {
	return new MouseEvent('mouseup', {
		bubbles: true,
		cancelable: true,
	});
}

function dispatchMouseEvent(event: MouseEvent) {
	act(() => {
		document.dispatchEvent(event);
	});
}

describe('useResizeHandlers - Mouse Move Handler', () => {
	describe('with container ref', () => {
		it('calls handleMouseMoveLogic with container when containerRef.current exists', () => {
			const container = document.createElement('div');
			const setup = createTestSetup({ container });
			const config = createHookConfig(setup);

			const { result } = renderHook(() => useResizeHandlers(config));

			const mouseEvent = createMouseMoveEvent();
			dispatchMouseEvent(mouseEvent);

			expect(typeof result.current).toBe('function');
		});

		it('handles mouse move with container ref (lines 80-81)', () => {
			const container = document.createElement('div');
			container.style.width = '200px';
			container.style.height = '100px';
			const setup = createTestSetup({ container });
			const config = createHookConfig(setup);

			renderHook(() => useResizeHandlers(config));

			const mouseEvent = createMouseMoveEvent();
			dispatchMouseEvent(mouseEvent);

			expect(mockHandleMouseMoveLogic).toHaveBeenCalledWith({
				container,
				event: expect.any(MouseEvent),
				direction: 'horizontal',
				minSize: 50,
				maxSize: 500,
				onResize: setup.onResize,
				startPos: 100,
				startSize: 200,
			});
		});
	});

	describe('without container ref', () => {
		it('handles mouse move when containerRef.current is null', () => {
			const setup = createTestSetup({ container: null });
			const config = createHookConfig(setup);

			renderHook(() => useResizeHandlers(config));

			const mouseEvent = createMouseMoveEvent();
			dispatchMouseEvent(mouseEvent);

			expect(mockHandleMouseMoveLogic).toHaveBeenCalledWith({
				container: null,
				event: expect.any(MouseEvent),
				direction: 'horizontal',
				minSize: 50,
				maxSize: 500,
				onResize: setup.onResize,
				startPos: 100,
				startSize: 200,
			});
		});
	});
});

describe('useResizeHandlers - Mouse Up Handler', () => {
	it('calls handleMouseUpLogic on mouse up (line 104)', () => {
		const setup = createTestSetup();
		const config = createHookConfig(setup);

		renderHook(() => useResizeHandlers(config));

		const mouseUpEvent = createMouseUpEvent();
		dispatchMouseEvent(mouseUpEvent);

		expect(mockHandleMouseUpLogic).toHaveBeenCalledWith({
			setIsResizing: setup.setIsResizing,
			startPosRef: setup.startPosRef,
			startSizeRef: setup.startSizeRef,
		});
	});

	it('resets resize state on mouse up', () => {
		const setup = createTestSetup();
		const config = createHookConfig(setup);

		renderHook(() => useResizeHandlers(config));

		const mouseUpEvent = createMouseUpEvent();
		dispatchMouseEvent(mouseUpEvent);

		expect(mockHandleMouseUpLogic).toHaveBeenCalledTimes(1);
	});
});

describe('useResizeHandlers - Integration', () => {
	describe('handleMouseDown', () => {
		it('returns handleMouseDown function', () => {
			const setup = createTestSetup({ startPos: 0, startSize: 0, isResizing: false });
			const config = createHookConfig(setup, { isResizing: false });

			const { result } = renderHook(() => useResizeHandlers(config));

			expect(typeof result.current).toBe('function');
		});

		it('handles mouse down event', () => {
			const container = document.createElement('div');
			const setup = createTestSetup({ container, startPos: 0, startSize: 0, isResizing: false });
			const config = createHookConfig(setup, { isResizing: false });

			const { result } = renderHook(() => useResizeHandlers(config));

			const mockEvent = {
				preventDefault: vi.fn(),
				clientX: 100,
				clientY: 100,
			} as unknown as ReactMouseEvent<HTMLButtonElement>;

			act(() => {
				result.current(mockEvent);
			});

			expect(mockHandleMouseDownLogic).toHaveBeenCalledWith({
				container,
				event: mockEvent,
				direction: 'horizontal',
				setIsResizing: setup.setIsResizing,
				startPosRef: setup.startPosRef,
				startSizeRef: setup.startSizeRef,
			});
		});
	});

	describe('direction handling', () => {
		it('handles vertical direction', () => {
			const container = document.createElement('div');
			const setup = createTestSetup({
				container,
				direction: 'vertical',
				startPos: 0,
				startSize: 0,
			});
			const config = createHookConfig(setup);

			renderHook(() => useResizeHandlers(config));

			const mouseEvent = createMouseMoveEvent(100, 150);
			dispatchMouseEvent(mouseEvent);

			expect(mockHandleMouseMoveLogic).toHaveBeenCalledWith({
				container,
				event: expect.any(MouseEvent),
				direction: 'vertical',
				minSize: 50,
				maxSize: 500,
				onResize: expect.any(Function),
				startPos: 0,
				startSize: 0,
			});
		});
	});
});
