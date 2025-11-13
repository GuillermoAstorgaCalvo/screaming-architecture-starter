import { type MouseEvent as ReactMouseEvent, useCallback, useState } from 'react';

import { INITIAL_RESIZE_STATE } from './useSplitter.handlers.constants';
import { useResizeEffect } from './useSplitter.handlers.effects';
import { processMouseDown, processMouseMove } from './useSplitter.handlers.processors';
import type {
	MouseDownContext,
	MouseMoveContext,
	ResizeState,
	UseSplitterHandlersParams,
} from './useSplitter.handlers.types';

export function useSplitterHandlers({
	panelRefs,
	orientation,
	disabled,
	onResize,
	setPanelSize,
	getPanelMinSize,
	getPanelMaxSize,
}: UseSplitterHandlersParams) {
	const [resizeState, setResizeState] = useState<ResizeState>(INITIAL_RESIZE_STATE);

	const handleMouseMove = useCallback(
		(event: MouseEvent) => {
			const context: MouseMoveContext = {
				resizeState,
				panelRefs,
				orientation,
				sizeGetters: { getPanelMinSize, getPanelMaxSize },
				setPanelSize,
				onResize,
			};
			processMouseMove(event, context);
		},
		[resizeState, panelRefs, orientation, getPanelMinSize, getPanelMaxSize, setPanelSize, onResize]
	);

	const handleMouseUp = useCallback(() => {
		setResizeState(INITIAL_RESIZE_STATE);
	}, []);

	const handleMouseDown = useCallback(
		(event: ReactMouseEvent<HTMLButtonElement>, panelIndex: number) => {
			const context: MouseDownContext = {
				disabled,
				panelRefs,
				orientation,
				setResizeState,
			};
			processMouseDown(event, panelIndex, context);
		},
		[disabled, panelRefs, orientation]
	);

	useResizeEffect(resizeState.isResizing, { handleMouseMove, handleMouseUp }, orientation);

	return { handleMouseDown, isResizing: resizeState.isResizing };
}
