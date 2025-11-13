import { useSplitterHandlers } from '@core/ui/utilities/splitter/hooks/useSplitter.handlers';
import {
	type PanelState,
	useSplitterState,
} from '@core/ui/utilities/splitter/hooks/useSplitter.state';
import type { SplitterOrientation, SplitterPanelConfig } from '@src-types/ui/layout/splitter';
import { type MouseEvent, type RefObject, useCallback, useEffect, useRef, useState } from 'react';

interface PanelRef {
	readonly id: string;
	readonly element: HTMLElement;
}

interface UseSplitterParams {
	readonly containerRef: RefObject<HTMLDivElement | null>;
	readonly panels: readonly SplitterPanelConfig[];
	readonly orientation: SplitterOrientation;
	readonly disabled: boolean;
	readonly onResize?: ((panelId: string, size: number) => void) | undefined;
}

interface UseSplitterReturn {
	readonly panelStates: readonly PanelState[];
	readonly panelRefs: readonly PanelRef[];
	readonly registerPanel: (id: string, element: HTMLElement) => void;
	readonly unregisterPanel: (id: string) => void;
	readonly handleMouseDown: (event: MouseEvent<HTMLButtonElement>, panelIndex: number) => void;
	readonly isResizing: boolean;
	readonly setPanelCollapsed: (panelId: string, collapsed: boolean) => void;
	readonly getPanelState: (panelId: string) => PanelState | undefined;
}

interface UsePanelRefsParams {
	readonly panels: readonly SplitterPanelConfig[];
}

interface UsePanelRefsReturn {
	readonly panelRefs: readonly PanelRef[];
	readonly registerPanel: (id: string, element: HTMLElement) => void;
	readonly unregisterPanel: (id: string) => void;
}

/**
 * Manages panel element references and their registration
 */
function usePanelRefs({ panels }: UsePanelRefsParams): UsePanelRefsReturn {
	const panelElementsRef = useRef<Map<string, HTMLElement>>(new Map());
	const [panelRefs, setPanelRefs] = useState<readonly PanelRef[]>([]);

	useEffect(() => {
		const refs = panels
			.map(panel => {
				const element = panelElementsRef.current.get(panel.id);
				if (!element) {
					return null;
				}
				return { id: panel.id, element };
			})
			.filter((ref): ref is PanelRef => ref !== null);
		setPanelRefs(refs);
	}, [panels]);

	const registerPanel = useCallback((id: string, element: HTMLElement) => {
		panelElementsRef.current.set(id, element);
	}, []);

	const unregisterPanel = useCallback((id: string) => {
		panelElementsRef.current.delete(id);
	}, []);

	return {
		panelRefs,
		registerPanel,
		unregisterPanel,
	};
}

interface UsePanelSizeCalculatorsParams {
	readonly getPanelState: (panelId: string) => PanelState | undefined;
}

interface UsePanelSizeCalculatorsReturn {
	readonly getPanelMinSize: (panelId: string) => number;
	readonly getPanelMaxSize: (panelId: string) => number | undefined;
}

/**
 * Provides functions to calculate panel size constraints
 */
function usePanelSizeCalculators({
	getPanelState,
}: UsePanelSizeCalculatorsParams): UsePanelSizeCalculatorsReturn {
	const getPanelMinSize = useCallback(
		(panelId: string): number => {
			const state = getPanelState(panelId);
			if (state?.collapsed) {
				return state.collapsedSize;
			}
			return state?.minSize ?? 0;
		},
		[getPanelState]
	);

	const getPanelMaxSize = useCallback(
		(panelId: string): number | undefined => {
			const state = getPanelState(panelId);
			return state?.maxSize;
		},
		[getPanelState]
	);

	return {
		getPanelMinSize,
		getPanelMaxSize,
	};
}

export function useSplitter({
	containerRef,
	panels,
	orientation,
	disabled,
	onResize,
}: UseSplitterParams): UseSplitterReturn {
	const { panelStates, setPanelSize, setPanelCollapsed, getPanelState } = useSplitterState({
		panels,
	});

	const { panelRefs, registerPanel, unregisterPanel } = usePanelRefs({ panels });

	const { getPanelMinSize, getPanelMaxSize } = usePanelSizeCalculators({ getPanelState });

	const { handleMouseDown, isResizing } = useSplitterHandlers({
		containerRef,
		panelRefs,
		orientation,
		disabled,
		onResize,
		setPanelSize,
		getPanelMinSize,
		getPanelMaxSize,
	});

	return {
		panelStates,
		panelRefs,
		registerPanel,
		unregisterPanel,
		handleMouseDown,
		isResizing,
		setPanelCollapsed,
		getPanelState,
	};
}
