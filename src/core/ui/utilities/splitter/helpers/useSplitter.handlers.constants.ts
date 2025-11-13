import type { ResizeState } from './useSplitter.handlers.types';

export const INITIAL_RESIZE_STATE: ResizeState = {
	isResizing: false,
	panelIndex: -1,
	startPos: 0,
	startSizes: [],
};
