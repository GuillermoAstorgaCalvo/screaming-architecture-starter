import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Splitter orientation types
 */
export type SplitterOrientation = 'horizontal' | 'vertical';

/**
 * Splitter panel size value (pixels or percentage)
 */
export type SplitterSize = string | number;

/**
 * Splitter panel configuration
 */
export interface SplitterPanelConfig {
	/** Unique identifier for the panel */
	id: string;
	/** Default size (in pixels or percentage) */
	defaultSize?: SplitterSize;
	/** Controlled size (in pixels or percentage) */
	size?: SplitterSize;
	/** Minimum size (in pixels or percentage) @default 0 */
	minSize?: SplitterSize;
	/** Maximum size (in pixels or percentage) */
	maxSize?: SplitterSize;
	/** Whether the panel is collapsible @default false */
	collapsible?: boolean;
	/** Whether the panel is collapsed by default @default false */
	defaultCollapsed?: boolean;
	/** Controlled collapsed state */
	collapsed?: boolean;
	/** Minimum size when collapsed (in pixels) @default 0 */
	collapsedSize?: number;
	/** Callback when panel size changes */
	onResize?: (size: number) => void;
	/** Callback when panel collapse state changes */
	onCollapseChange?: (collapsed: boolean) => void;
}

/**
 * Splitter component props
 */
export interface SplitterProps extends HTMLAttributes<HTMLDivElement> {
	/** Splitter panels */
	children: ReactNode;
	/** Orientation of the splitter @default 'horizontal' */
	orientation?: SplitterOrientation;
	/** Panel configurations */
	panels?: readonly SplitterPanelConfig[];
	/** Callback when any panel is resized */
	onResize?: (panelId: string, size: number) => void;
	/** Whether resizing is disabled @default false */
	disabled?: boolean;
	/** Size of the resize handle in pixels @default 4 */
	handleSize?: number;
	/** Custom className for resize handles */
	handleClassName?: string;
}

/**
 * SplitterPanel component props
 */
export interface SplitterPanelProps extends HTMLAttributes<HTMLDivElement> {
	/** Panel content */
	children: ReactNode;
	/** Unique identifier for the panel */
	id: string;
	/** Default size (in pixels or percentage) */
	defaultSize?: SplitterSize;
	/** Controlled size (in pixels or percentage) */
	size?: SplitterSize;
	/** Minimum size (in pixels or percentage) @default 0 */
	minSize?: SplitterSize;
	/** Maximum size (in pixels or percentage) */
	maxSize?: SplitterSize;
	/** Whether the panel is collapsible @default false */
	collapsible?: boolean;
	/** Whether the panel is collapsed by default @default false */
	defaultCollapsed?: boolean;
	/** Controlled collapsed state */
	collapsed?: boolean;
	/** Minimum size when collapsed (in pixels) @default 0 */
	collapsedSize?: number;
	/** Callback when panel size changes */
	onResize?: (size: number) => void;
	/** Callback when panel collapse state changes */
	onCollapseChange?: (collapsed: boolean) => void;
}
