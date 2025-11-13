import type { useSplitter } from '@core/ui/utilities/splitter/hooks/useSplitter';
import type { SplitterOrientation } from '@src-types/ui/layout/splitter';
import { useMemo } from 'react';

interface CreateSplitterContextValueParams {
	readonly orientation: SplitterOrientation;
	readonly disabled: boolean;
	readonly handleSize: number;
	readonly handleClassName: string | undefined;
	readonly splitterState: ReturnType<typeof useSplitter>;
}

/**
 * Create splitter context value
 */
export function createSplitterContextValue({
	orientation,
	disabled,
	handleSize,
	handleClassName,
	splitterState,
}: CreateSplitterContextValueParams) {
	return {
		orientation,
		disabled,
		handleSize,
		...(handleClassName !== undefined && { handleClassName }),
		panelStates: splitterState.panelStates,
		registerPanel: splitterState.registerPanel,
		unregisterPanel: splitterState.unregisterPanel,
		handleMouseDown: splitterState.handleMouseDown,
		isResizing: splitterState.isResizing,
		setPanelCollapsed: splitterState.setPanelCollapsed,
		getPanelState: splitterState.getPanelState,
	};
}

/**
 * Hook to create memoized splitter context value
 */
export function useSplitterContextValue({
	orientation,
	disabled,
	handleSize,
	handleClassName,
	splitterState,
}: CreateSplitterContextValueParams) {
	return useMemo(
		() =>
			createSplitterContextValue({
				orientation,
				disabled,
				handleSize,
				handleClassName,
				splitterState,
			}),
		[orientation, disabled, handleSize, handleClassName, splitterState]
	);
}
