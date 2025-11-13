import { useSplitterContextValue } from '@core/ui/utilities/splitter/helpers/Splitter.context';
import { useSplitter } from '@core/ui/utilities/splitter/hooks/useSplitter';
import type { SplitterOrientation, SplitterPanelConfig } from '@src-types/ui/layout/splitter';
import type { RefObject } from 'react';

interface UseSplitterSetupParams {
	readonly containerRef: RefObject<HTMLDivElement | null>;
	readonly panelConfigs: readonly SplitterPanelConfig[];
	readonly orientation: SplitterOrientation;
	readonly disabled: boolean;
	readonly onResize: ((panelId: string, size: number) => void) | undefined;
	readonly handleSize: number;
	readonly handleClassName: string | undefined;
}

/**
 * Hook to setup splitter state and context
 */
export function useSplitterSetup({
	containerRef,
	panelConfigs,
	orientation,
	disabled,
	onResize,
	handleSize,
	handleClassName,
}: UseSplitterSetupParams) {
	const splitterState = useSplitter({
		containerRef,
		panels: panelConfigs,
		orientation,
		disabled,
		onResize,
	});

	return useSplitterContextValue({
		orientation,
		disabled,
		handleSize,
		handleClassName,
		splitterState,
	});
}
