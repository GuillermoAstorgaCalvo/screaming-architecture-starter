/**
 * Shared test helpers for splitter handler processor tests
 */

import type {
	MouseDownContext,
	MouseMoveContext,
	PanelRef,
	ResizeState,
} from '@core/ui/utilities/splitter/types/useSplitter.handlers.types';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { vi } from 'vitest';

// Mock the calculation functions
export const mockCalculatePanelSizes: ReturnType<typeof vi.fn> = vi.fn();
export const mockGetPanelConstraints: ReturnType<typeof vi.fn> = vi.fn();
export const mockCalculateNewSize: ReturnType<typeof vi.fn> = vi.fn();
export const mockGetDimension: ReturnType<typeof vi.fn> = vi.fn();
export const mockSetDimension: ReturnType<typeof vi.fn> = vi.fn();
export const mockIsHorizontal: ReturnType<typeof vi.fn> = vi.fn();

// Helper functions for test setup
export function createPanelElement(dimension: 'width' | 'height', size: number): HTMLDivElement {
	const element = document.createElement('div');
	const property = dimension === 'width' ? 'offsetWidth' : 'offsetHeight';
	Object.defineProperty(element, property, { value: size, writable: false });
	return element;
}

export function createPanel(id: string, dimension: 'width' | 'height', size: number): PanelRef {
	return {
		id,
		element: createPanelElement(dimension, size),
	};
}

export function createMouseEvent(
	clientX: number,
	clientY: number
): ReactMouseEvent<HTMLButtonElement> {
	return {
		clientX,
		clientY,
		preventDefault: vi.fn(),
		stopPropagation: vi.fn(),
	} as unknown as ReactMouseEvent<HTMLButtonElement>;
}

export function createMouseMoveEvent(clientX: number, clientY: number): MouseEvent {
	return {
		clientX,
		clientY,
	} as MouseEvent;
}

export function createMouseDownContext(
	panelRefs: PanelRef[],
	options?: { disabled?: boolean; orientation?: 'horizontal' | 'vertical' }
): MouseDownContext {
	return {
		disabled: options?.disabled ?? false,
		panelRefs,
		orientation: options?.orientation ?? 'horizontal',
		setResizeState: vi.fn(),
	};
}

export function createMouseMoveContext(
	panelRefs: PanelRef[],
	resizeState: ResizeState,
	options?: {
		orientation?: 'horizontal' | 'vertical';
		onResize?: (panelId: string, size: number) => void;
		sizeGetters?: {
			getPanelMinSize: (id: string) => number;
			getPanelMaxSize: (id: string) => number | undefined;
		};
	}
): MouseMoveContext {
	return {
		resizeState,
		panelRefs,
		orientation: options?.orientation ?? 'horizontal',
		sizeGetters: options?.sizeGetters ?? {
			getPanelMinSize: () => 0,
			getPanelMaxSize: () => undefined,
		},
		setPanelSize: vi.fn(),
		onResize: options?.onResize,
	};
}

export function createResizeState(
	panelIndex: number,
	startPos: number,
	startSizes: number[],
	isResizing = true
): ResizeState {
	return {
		isResizing,
		panelIndex,
		startPos,
		startSizes,
	};
}

export function setupMockConstraints(
	panelMinSize = 0,
	panelMaxSize?: number,
	nextPanelMinSize = 0,
	nextPanelMaxSize?: number
): void {
	mockGetPanelConstraints.mockReturnValue({
		panelMinSize,
		panelMaxSize,
		nextPanelMinSize,
		nextPanelMaxSize,
	});
}
