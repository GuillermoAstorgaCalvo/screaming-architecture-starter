import type { SplitterOrientation } from '@src-types/ui/layout/splitter';
import { createContext, type MouseEvent, useContext } from 'react';

import type { PanelState } from './useSplitter.state';

interface SplitterContextValue {
	readonly orientation: SplitterOrientation;
	readonly disabled: boolean;
	readonly handleSize: number;
	readonly handleClassName?: string;
	readonly panelStates: readonly PanelState[];
	readonly registerPanel: (id: string, element: HTMLElement) => void;
	readonly unregisterPanel: (id: string) => void;
	readonly handleMouseDown: (event: MouseEvent<HTMLButtonElement>, panelIndex: number) => void;
	readonly isResizing: boolean;
	readonly setPanelCollapsed: (panelId: string, collapsed: boolean) => void;
	readonly getPanelState: (panelId: string) => PanelState | undefined;
}

export const SplitterContext = createContext<SplitterContextValue | null>(null);

export function useSplitterContext(): SplitterContextValue {
	const context = useContext(SplitterContext);
	if (!context) {
		throw new Error('SplitterPanel must be used within a Splitter component');
	}
	return context;
}
