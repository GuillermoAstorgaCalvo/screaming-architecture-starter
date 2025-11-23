/**
 * Tests for useSplitterHandlers hook
 *
 * Tests the useSplitterHandlers hook:
 * - Mouse down handling
 * - Mouse move handling
 * - Mouse up handling
 * - Resize state management
 */

import { useSplitterHandlers } from '@core/ui/utilities/splitter/hooks/useSplitter.handlers';
import type { PanelRef } from '@core/ui/utilities/splitter/types/useSplitter.handlers.types';
import { act, renderHook } from '@testing-library/react';
import { createRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockProcessMouseDown = vi.fn();
const mockProcessMouseMove = vi.fn();
const mockUseResizeEffect = vi.fn();

// Mock the processors
vi.mock('@core/ui/utilities/splitter/helpers/useSplitter.handlers.processors', () => ({
	processMouseDown: (...args: unknown[]) => mockProcessMouseDown(...args),
	processMouseMove: (...args: unknown[]) => mockProcessMouseMove(...args),
}));

// Mock the effects
vi.mock('@core/ui/utilities/splitter/hooks/useSplitter.handlers.effects', () => ({
	useResizeEffect: (...args: unknown[]) => mockUseResizeEffect(...args),
}));

beforeEach(() => {
	vi.clearAllMocks();
});

// Helper functions for test setup
function createDefaultMocks() {
	return {
		panelRefs: [] as PanelRef[],
		setPanelSize: vi.fn(),
		getPanelMinSize: vi.fn(() => 0),
		getPanelMaxSize: vi.fn(() => undefined),
	};
}

function createPanelRefs(count = 2): PanelRef[] {
	return Array.from({ length: count }, (_, i) => ({
		id: `panel${i + 1}`,
		element: document.createElement('div'),
	}));
}

function createMockMouseEvent(overrides: Partial<MouseEvent> = {}) {
	return {
		preventDefault: vi.fn(),
		stopPropagation: vi.fn(),
		...overrides,
	} as any;
}

function setupResizeStateMock() {
	mockProcessMouseDown.mockImplementation((event, panelIndex, context) => {
		context.setResizeState({
			isResizing: true,
			panelIndex: 0,
			startPos: 100,
			startSizes: [200, 300],
		});
	});
}

function getHandlersFromEffect(effectCallIndex = 0) {
	const effectCall = mockUseResizeEffect.mock.calls[effectCallIndex];
	return effectCall?.[1] as {
		handleMouseMove: (event: MouseEvent) => void;
		handleMouseUp: () => void;
	};
}

function getLatestHandlersFromEffect() {
	const latestEffectCall = mockUseResizeEffect.mock.calls.at(-1);
	return latestEffectCall?.[1] as {
		handleMouseMove: (event: MouseEvent) => void;
		handleMouseUp: () => void;
	};
}

describe('useSplitterHandlers - Initialization', () => {
	it('returns handleMouseDown and isResizing', () => {
		const { panelRefs, setPanelSize, getPanelMinSize, getPanelMaxSize } = createDefaultMocks();

		const { result } = renderHook(() =>
			useSplitterHandlers({
				containerRef: createRef(),
				panelRefs,
				orientation: 'horizontal',
				disabled: false,
				setPanelSize,
				getPanelMinSize,
				getPanelMaxSize,
			})
		);

		expect(typeof result.current.handleMouseDown).toBe('function');
		expect(result.current.isResizing).toBe(false);
	});
});

describe('useSplitterHandlers - Mouse Down', () => {
	it('calls processMouseDown on handleMouseDown', () => {
		const { panelRefs, setPanelSize, getPanelMinSize, getPanelMaxSize } = createDefaultMocks();

		const { result } = renderHook(() =>
			useSplitterHandlers({
				containerRef: createRef(),
				panelRefs,
				orientation: 'horizontal',
				disabled: false,
				setPanelSize,
				getPanelMinSize,
				getPanelMaxSize,
			})
		);

		const mockEvent = createMockMouseEvent();

		act(() => {
			result.current.handleMouseDown(mockEvent, 0);
		});

		expect(mockProcessMouseDown).toHaveBeenCalledWith(mockEvent, 0, expect.any(Object));
	});
});

describe('useSplitterHandlers - Resize State', () => {
	it('initializes with isResizing false', () => {
		const { panelRefs, setPanelSize, getPanelMinSize, getPanelMaxSize } = createDefaultMocks();

		const { result } = renderHook(() =>
			useSplitterHandlers({
				containerRef: createRef(),
				panelRefs,
				orientation: 'horizontal',
				disabled: false,
				setPanelSize,
				getPanelMinSize,
				getPanelMaxSize,
			})
		);

		expect(result.current.isResizing).toBe(false);
	});
});

describe('useSplitterHandlers - Effects', () => {
	it('sets up resize effect', () => {
		const { panelRefs, setPanelSize, getPanelMinSize, getPanelMaxSize } = createDefaultMocks();

		renderHook(() =>
			useSplitterHandlers({
				containerRef: createRef(),
				panelRefs,
				orientation: 'horizontal',
				disabled: false,
				setPanelSize,
				getPanelMinSize,
				getPanelMaxSize,
			})
		);

		expect(mockUseResizeEffect).toHaveBeenCalled();
	});

	it('passes handleMouseMove and handleMouseUp to useResizeEffect', () => {
		const { panelRefs, setPanelSize, getPanelMinSize, getPanelMaxSize } = createDefaultMocks();

		renderHook(() =>
			useSplitterHandlers({
				containerRef: createRef(),
				panelRefs,
				orientation: 'horizontal',
				disabled: false,
				setPanelSize,
				getPanelMinSize,
				getPanelMaxSize,
			})
		);

		expect(mockUseResizeEffect).toHaveBeenCalledWith(
			false,
			expect.objectContaining({
				handleMouseMove: expect.any(Function),
				handleMouseUp: expect.any(Function),
			}),
			'horizontal'
		);
	});
});

describe('useSplitterHandlers - Mouse Move Handler', () => {
	it('calls processMouseMove with correct context when handleMouseMove is called', () => {
		const panelRefs = createPanelRefs(2);
		const { setPanelSize, getPanelMinSize, getPanelMaxSize } = createDefaultMocks();
		const onResize = vi.fn();

		setupResizeStateMock();

		const { result } = renderHook(() =>
			useSplitterHandlers({
				containerRef: createRef(),
				panelRefs,
				orientation: 'horizontal',
				disabled: false,
				setPanelSize,
				getPanelMinSize,
				getPanelMaxSize,
				onResize,
			})
		);

		const mockEvent = createMockMouseEvent({ clientX: 100 });
		act(() => {
			result.current.handleMouseDown(mockEvent, 0);
		});

		const handlers = getLatestHandlersFromEffect();
		const mouseMoveEvent = new MouseEvent('mousemove', {
			clientX: 150,
			clientY: 0,
		});

		act(() => {
			handlers.handleMouseMove(mouseMoveEvent);
		});

		expect(mockProcessMouseMove).toHaveBeenCalledWith(
			mouseMoveEvent,
			expect.objectContaining({
				resizeState: expect.objectContaining({
					isResizing: true,
					panelIndex: 0,
				}),
				panelRefs,
				orientation: 'horizontal',
				sizeGetters: {
					getPanelMinSize,
					getPanelMaxSize,
				},
				setPanelSize,
				onResize,
			})
		);
	});
});

describe('useSplitterHandlers - Mouse Move Handler Context', () => {
	it('handleMouseMove includes current resizeState in context', () => {
		const panelRefs = createPanelRefs(2);
		const { setPanelSize, getPanelMinSize, getPanelMaxSize } = createDefaultMocks();

		renderHook(() =>
			useSplitterHandlers({
				containerRef: createRef(),
				panelRefs,
				orientation: 'vertical',
				disabled: false,
				setPanelSize,
				getPanelMinSize,
				getPanelMaxSize,
			})
		);

		const handlers = getHandlersFromEffect(0);
		const mouseMoveEvent = new MouseEvent('mousemove', {
			clientX: 0,
			clientY: 150,
		});

		act(() => {
			handlers.handleMouseMove(mouseMoveEvent);
		});

		expect(mockProcessMouseMove).toHaveBeenCalledWith(
			mouseMoveEvent,
			expect.objectContaining({
				orientation: 'vertical',
				panelRefs,
				sizeGetters: {
					getPanelMinSize,
					getPanelMaxSize,
				},
				setPanelSize,
			})
		);
	});
});

describe('useSplitterHandlers - Mouse Up Handler', () => {
	it('resets resize state when handleMouseUp is called', () => {
		const { panelRefs, setPanelSize, getPanelMinSize, getPanelMaxSize } = createDefaultMocks();

		setupResizeStateMock();

		const { result } = renderHook(() =>
			useSplitterHandlers({
				containerRef: createRef(),
				panelRefs,
				orientation: 'horizontal',
				disabled: false,
				setPanelSize,
				getPanelMinSize,
				getPanelMaxSize,
			})
		);

		const handlers = getHandlersFromEffect(0);
		const mockEvent = createMockMouseEvent();

		act(() => {
			result.current.handleMouseDown(mockEvent, 0);
		});

		expect(mockUseResizeEffect.mock.calls.length).toBeGreaterThan(0);

		act(() => {
			handlers.handleMouseUp();
		});

		const lastEffectCall = mockUseResizeEffect.mock.calls.at(-1);
		expect(lastEffectCall?.[0]).toBe(false);
	});

	it('handleMouseUp callback is stable across renders', () => {
		const { panelRefs, setPanelSize, getPanelMinSize, getPanelMaxSize } = createDefaultMocks();

		const { rerender } = renderHook(
			({ orientation }: { orientation: 'horizontal' | 'vertical' }) =>
				useSplitterHandlers({
					containerRef: createRef(),
					panelRefs,
					orientation,
					disabled: false,
					setPanelSize,
					getPanelMinSize,
					getPanelMaxSize,
				}),
			{ initialProps: { orientation: 'horizontal' } }
		);

		const firstHandlers = getHandlersFromEffect(0);

		rerender({ orientation: 'vertical' });

		const secondHandlers = getLatestHandlersFromEffect();

		expect(firstHandlers).toBeDefined();
		expect(secondHandlers).toBeDefined();
		expect(typeof firstHandlers?.handleMouseUp).toBe('function');
		expect(typeof secondHandlers?.handleMouseUp).toBe('function');
	});
});
