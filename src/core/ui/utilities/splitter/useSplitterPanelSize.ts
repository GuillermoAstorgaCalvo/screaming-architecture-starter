import type { SplitterOrientation, SplitterSize } from '@src-types/ui/layout/splitter';
import { type RefObject, useEffect } from 'react';

import { parseDefaultSize, setDimension } from './useSplitter.helpers';
import type { PanelState } from './useSplitter.state';

interface UseSplitterPanelSizeParams {
	readonly panelRef: RefObject<HTMLDivElement | null>;
	readonly orientation: SplitterOrientation;
	readonly panelState?: PanelState | undefined;
	readonly isCollapsed: boolean;
	readonly collapsible: boolean;
	readonly collapsedSize: number;
	readonly defaultSize?: SplitterSize | undefined;
}

export function useSplitterPanelSize({
	panelRef,
	orientation,
	panelState,
	isCollapsed,
	collapsible,
	collapsedSize,
	defaultSize,
}: UseSplitterPanelSizeParams): void {
	useEffect(() => {
		const element = panelRef.current;
		if (!element) {
			return;
		}

		if (isCollapsed && collapsible) {
			setDimension(orientation, element, collapsedSize);
			return;
		}

		const currentSize = panelState?.size;
		if (currentSize !== undefined) {
			setDimension(orientation, element, currentSize);
			return;
		}

		if (defaultSize !== undefined) {
			const parsedSize = parseDefaultSize(defaultSize, orientation, element);
			if (parsedSize !== null) {
				setDimension(orientation, element, parsedSize);
			}
		}
	}, [panelRef, orientation, panelState, isCollapsed, collapsible, collapsedSize, defaultSize]);
}
