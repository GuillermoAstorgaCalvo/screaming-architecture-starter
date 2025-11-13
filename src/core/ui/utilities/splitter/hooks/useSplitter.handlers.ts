import { INITIAL_RESIZE_STATE } from '@core/ui/utilities/splitter/helpers/useSplitter.handlers.constants';
import {
	processMouseDown,
	processMouseMove,
} from '@core/ui/utilities/splitter/helpers/useSplitter.handlers.processors';
import { useResizeEffect } from '@core/ui/utilities/splitter/hooks/useSplitter.handlers.effects';
import type {
	MouseDownContext,
	MouseMoveContext,
	ResizeState,
	UseSplitterHandlersParams,
} from '@core/ui/utilities/splitter/types/useSplitter.handlers.types';
import { type MouseEvent as ReactMouseEvent, useCallback, useState } from 'react';

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
