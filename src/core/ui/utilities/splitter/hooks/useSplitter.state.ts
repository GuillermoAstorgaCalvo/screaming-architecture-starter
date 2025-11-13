import type { SplitterPanelConfig, SplitterSize } from '@src-types/ui/layout/splitter';
import { useState } from 'react';

export interface PanelState {
	readonly id: string;
	readonly size: number | undefined;
	readonly collapsed: boolean;
	readonly minSize: number;
	readonly maxSize: number | undefined;
	readonly collapsible: boolean;
	readonly collapsedSize: number;
}

interface UseSplitterStateParams {
	readonly panels: readonly SplitterPanelConfig[];
}

interface UseSplitterStateReturn {
	readonly panelStates: readonly PanelState[];
	readonly setPanelSize: (panelId: string, size: number) => void;
	readonly setPanelCollapsed: (panelId: string, collapsed: boolean) => void;
	readonly getPanelState: (panelId: string) => PanelState | undefined;
}

/**
 * Parse size value to pixels (for min/max constraints, use raw values)
 */
function parseSizeValue(size: SplitterSize | undefined): number | undefined {
	if (size === undefined) {
		return undefined;
	}
	if (typeof size === 'number') {
		return size;
	}
	if (size.endsWith('px')) {
		return Number.parseFloat(size);
	}
	// For percentages and other values, return undefined to handle later
	return undefined;
}

/**
 * Initialize panel states from config
 */
function initializePanelStates(panels: readonly SplitterPanelConfig[]): readonly PanelState[] {
	return panels.map(panel => {
		const minSize = parseSizeValue(panel.minSize) ?? 0;
		const maxSize = panel.maxSize ? parseSizeValue(panel.maxSize) : undefined;
		const collapsed = panel.collapsed ?? panel.defaultCollapsed ?? false;
		const collapsedSize = panel.collapsedSize ?? 0;

		return {
			id: panel.id,
			size: undefined, // Will be set during resize or from defaultSize
			collapsed,
			minSize,
			maxSize,
			collapsible: panel.collapsible ?? false,
			collapsedSize,
		};
	});
}

export function useSplitterState({ panels }: UseSplitterStateParams): UseSplitterStateReturn {
	const [panelStates, setPanelStates] = useState<readonly PanelState[]>(() =>
		initializePanelStates(panels)
	);

	const setPanelSize = (panelId: string, size: number) => {
		setPanelStates(prevStates => {
			return prevStates.map(state => {
				if (state.id === panelId) {
					const constrainedSize = applySizeConstraints(size, state.minSize, state.maxSize);
					return { ...state, size: constrainedSize };
				}
				return state;
			});
		});
	};

	const setPanelCollapsed = (panelId: string, collapsed: boolean) => {
		setPanelStates(prevStates => {
			return prevStates.map(state => {
				if (state.id === panelId && state.collapsible) {
					return { ...state, collapsed };
				}
				return state;
			});
		});
	};

	const getPanelState = (panelId: string): PanelState | undefined => {
		return panelStates.find(state => state.id === panelId);
	};

	return {
		panelStates,
		setPanelSize,
		setPanelCollapsed,
		getPanelState,
	};
}

function applySizeConstraints(size: number, minSize: number, maxSize: number | undefined): number {
	if (size < minSize) {
		return minSize;
	}
	if (maxSize !== undefined && size > maxSize) {
		return maxSize;
	}
	return size;
}
