import type { SplitterOrientation } from '@src-types/ui/layout/splitter';
import type { MouseEvent as ReactMouseEvent, RefObject } from 'react';

export interface PanelRef {
	readonly id: string;
	readonly element: HTMLElement;
}

export interface UseSplitterHandlersParams {
	readonly containerRef: RefObject<HTMLDivElement | null>;
	readonly panelRefs: readonly PanelRef[];
	readonly orientation: SplitterOrientation;
	readonly disabled: boolean;
	readonly onResize?: ((panelId: string, size: number) => void) | undefined;
	readonly setPanelSize: (panelId: string, size: number) => void;
	readonly getPanelMinSize: (panelId: string) => number;
	readonly getPanelMaxSize: (panelId: string) => number | undefined;
}

export interface ResizeState {
	readonly isResizing: boolean;
	readonly panelIndex: number;
	readonly startPos: number;
	readonly startSizes: readonly number[];
}

export interface PanelConstraints {
	readonly panelMinSize: number;
	readonly panelMaxSize: number | undefined;
	readonly nextPanelMinSize: number;
	readonly nextPanelMaxSize: number | undefined;
}

export interface SizeGetters {
	readonly getPanelMinSize: (panelId: string) => number;
	readonly getPanelMaxSize: (panelId: string) => number | undefined;
}

export interface PanelSizeParams {
	readonly panel: PanelRef;
	readonly nextPanel: PanelRef;
	readonly orientation: SplitterOrientation;
}

export interface ResizeHandlers {
	readonly handleMouseMove: (event: MouseEvent) => void;
	readonly handleMouseUp: () => void;
}

export interface MouseMoveContext {
	readonly resizeState: ResizeState;
	readonly panelRefs: readonly PanelRef[];
	readonly orientation: SplitterOrientation;
	readonly sizeGetters: SizeGetters;
	readonly setPanelSize: (panelId: string, size: number) => void;
	readonly onResize?: ((panelId: string, size: number) => void) | undefined;
}

export interface MouseDownContext {
	readonly disabled: boolean;
	readonly panelRefs: readonly PanelRef[];
	readonly orientation: SplitterOrientation;
	readonly setResizeState: (state: ResizeState) => void;
}

export type MouseDownHandler = (
	event: ReactMouseEvent<HTMLButtonElement>,
	panelIndex: number
) => void;
