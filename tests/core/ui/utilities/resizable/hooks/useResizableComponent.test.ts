/**
 * Tests for useResizableComponent hook
 *
 * Tests the useResizableComponent hook:
 * - Controlled vs uncontrolled mode (lines 49-52)
 * - onResize callback behavior
 * - Internal size state management
 */

import { useResizableComponent } from '@core/ui/utilities/resizable/hooks/useResizableComponent';
import { act, renderHook } from '@testing-library/react';
import { createRef, type RefObject } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the dependencies
const mockUseResizableState = vi.fn();
const mockUseResizable = vi.fn();
const mockParseSize = vi.fn((size: string | number) => {
	if (typeof size === 'number') return size;
	if (typeof size === 'string' && size.endsWith('px')) {
		return Number.parseFloat(size);
	}
	if (typeof size === 'string' && size.endsWith('%')) {
		return Number.parseFloat(size);
	}
	return size;
});

vi.mock('@core/ui/utilities/resizable/hooks/useResizableState', () => ({
	useResizableState: (args: unknown) => mockUseResizableState(args),
}));

vi.mock('@core/ui/utilities/resizable/hooks/useResizable', () => ({
	useResizable: (args: unknown) => mockUseResizable(args),
}));

vi.mock('@core/ui/utilities/resizable/helpers/Resizable.helpers', () => ({
	parseSize: (args: string | number) => mockParseSize(args),
}));

beforeEach(() => {
	vi.clearAllMocks();
});

// Helper functions
function setupResizableStateMocks(
	currentSize: number,
	setInternalSize: ReturnType<typeof vi.fn>,
	isControlled: boolean
) {
	mockUseResizableState.mockReturnValue({
		currentSize,
		setInternalSize,
		isControlled,
	});
}

function setupResizableMocks(handleMouseDown: ReturnType<typeof vi.fn>, isResizing = false) {
	mockUseResizable.mockReturnValue({
		handleMouseDown,
		isResizing,
	});
}

function renderResizableComponent(params: {
	containerRef: ReturnType<typeof createRef<HTMLDivElement>>;
	defaultSize?: number;
	controlledSize?: number;
	direction?: 'horizontal' | 'vertical';
	minSize?: number;
	maxSize?: number | undefined;
	onResize?: ((size: number) => void) | undefined;
	disabled?: boolean;
}) {
	return renderHook(() =>
		useResizableComponent({
			containerRef: params.containerRef as RefObject<HTMLDivElement>,
			defaultSize: params.defaultSize,
			controlledSize: params.controlledSize,
			direction: params.direction ?? 'horizontal',
			minSize: params.minSize ?? 50,
			maxSize: 'maxSize' in params ? params.maxSize : 500,
			onResize: params.onResize,
			disabled: params.disabled ?? false,
		})
	);
}

function getResizeCallback() {
	const [useResizableCall] = mockUseResizable.mock.calls;
	if (!useResizableCall) {
		throw new Error('useResizable was not called');
	}
	return useResizableCall[0].onResize;
}

function callResizeCallback(size: number) {
	const resizeCallback = getResizeCallback();
	act(() => {
		resizeCallback(size);
	});
}

describe('useResizableComponent - Uncontrolled Mode', () => {
	it('calls setInternalSize when not controlled (lines 49-52)', () => {
		const setInternalSize = vi.fn();
		const handleMouseDown = vi.fn();
		const onResize = vi.fn();
		const containerRef = createRef<HTMLDivElement>();

		setupResizableStateMocks(200, setInternalSize, false);
		setupResizableMocks(handleMouseDown);

		renderResizableComponent({
			containerRef,
			defaultSize: 200,
			onResize,
		});

		callResizeCallback(250);

		expect(setInternalSize).toHaveBeenCalledWith(250);
		expect(onResize).toHaveBeenCalledWith(250);
	});

	it('calls onResize callback in uncontrolled mode', () => {
		const setInternalSize = vi.fn();
		const handleMouseDown = vi.fn();
		const onResize = vi.fn();
		const containerRef = createRef<HTMLDivElement>();

		setupResizableStateMocks(200, setInternalSize, false);
		setupResizableMocks(handleMouseDown);

		renderResizableComponent({
			containerRef,
			defaultSize: 200,
			onResize,
		});

		callResizeCallback(300);

		expect(onResize).toHaveBeenCalledWith(300);
		expect(setInternalSize).toHaveBeenCalledWith(300);
	});
});

describe('useResizableComponent - Controlled Mode', () => {
	it('does not call setInternalSize when controlled (lines 49-52)', () => {
		const setInternalSize = vi.fn();
		const handleMouseDown = vi.fn();
		const onResize = vi.fn();
		const containerRef = createRef<HTMLDivElement>();

		setupResizableStateMocks(200, setInternalSize, true);
		setupResizableMocks(handleMouseDown);

		renderResizableComponent({
			containerRef,
			controlledSize: 200,
			onResize,
		});

		callResizeCallback(250);

		expect(setInternalSize).not.toHaveBeenCalled();
		expect(onResize).toHaveBeenCalledWith(250);
	});

	it('calls onResize callback in controlled mode', () => {
		const setInternalSize = vi.fn();
		const handleMouseDown = vi.fn();
		const onResize = vi.fn();
		const containerRef = createRef<HTMLDivElement>();

		setupResizableStateMocks(200, setInternalSize, true);
		setupResizableMocks(handleMouseDown);

		renderResizableComponent({
			containerRef,
			controlledSize: 200,
			onResize,
		});

		callResizeCallback(300);

		expect(onResize).toHaveBeenCalledWith(300);
		expect(setInternalSize).not.toHaveBeenCalled();
	});
});

describe('useResizableComponent - onResize Optional', () => {
	it('handles undefined onResize callback', () => {
		const setInternalSize = vi.fn();
		const handleMouseDown = vi.fn();
		const containerRef = createRef<HTMLDivElement>();

		setupResizableStateMocks(200, setInternalSize, false);
		setupResizableMocks(handleMouseDown);

		renderResizableComponent({
			containerRef,
			defaultSize: 200,
		});

		callResizeCallback(250);

		expect(setInternalSize).toHaveBeenCalledWith(250);
	});
});

describe('useResizableComponent - Return Values', () => {
	it('returns currentSize, handleMouseDown, and isResizing', () => {
		const handleMouseDown = vi.fn();
		const containerRef = createRef<HTMLDivElement>();

		setupResizableStateMocks(200, vi.fn(), false);
		setupResizableMocks(handleMouseDown);

		const { result } = renderResizableComponent({
			containerRef,
			defaultSize: 200,
			onResize: vi.fn(),
		});

		expect(result.current.currentSize).toBe(200);
		expect(result.current.handleMouseDown).toBe(handleMouseDown);
		expect(result.current.isResizing).toBe(false);
	});
});

describe('useResizableComponent - Parameters', () => {
	it('passes correct parameters to useResizable', () => {
		const containerRef = createRef<HTMLDivElement>();
		const onResize = vi.fn();

		setupResizableStateMocks(200, vi.fn(), false);
		setupResizableMocks(vi.fn());

		renderResizableComponent({
			containerRef,
			defaultSize: 200,
			direction: 'vertical',
			minSize: 100,
			maxSize: 800,
			onResize,
			disabled: true,
		});

		expect(mockUseResizable).toHaveBeenCalledWith({
			containerRef,
			direction: 'vertical',
			minSize: expect.any(Number),
			maxSize: expect.any(Number),
			currentSize: 200,
			onResize: expect.any(Function),
			disabled: true,
		});
	});

	it('handles undefined direction (defaults to horizontal)', () => {
		const containerRef = createRef<HTMLDivElement>();

		setupResizableStateMocks(200, vi.fn(), false);
		setupResizableMocks(vi.fn());

		renderResizableComponent({
			containerRef,
			defaultSize: 200,
			onResize: vi.fn(),
		});

		expect(mockUseResizable).toHaveBeenCalledWith(
			expect.objectContaining({
				direction: 'horizontal',
			})
		);
	});

	it('handles undefined maxSize', () => {
		const containerRef = createRef<HTMLDivElement>();

		setupResizableStateMocks(200, vi.fn(), false);
		setupResizableMocks(vi.fn());

		renderResizableComponent({
			containerRef,
			defaultSize: 200,
			maxSize: undefined,
			onResize: vi.fn(),
		});

		const [useResizableCall] = mockUseResizable.mock.calls;
		expect(useResizableCall?.[0].maxSize).toBeUndefined();
	});
});
