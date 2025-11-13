import {
	calculatePanelSizes,
	getPanelConstraints,
} from '@core/ui/utilities/splitter/helpers/useSplitter.handlers.calculations';
import {
	calculateNewSize,
	getDimension,
	isHorizontal,
	setDimension,
} from '@core/ui/utilities/splitter/helpers/useSplitter.helpers';
import type {
	MouseDownContext,
	MouseMoveContext,
	PanelRef,
} from '@core/ui/utilities/splitter/types/useSplitter.handlers.types';
import type { SplitterOrientation } from '@src-types/ui/layout/splitter';
import type { MouseEvent as ReactMouseEvent } from 'react';

interface UpdatePanelsParams {
	readonly panel: PanelRef;
	readonly nextPanel: PanelRef;
	readonly newPanelSize: number;
	readonly newNextPanelSize: number;
	readonly orientation: SplitterOrientation;
	readonly setPanelSize: (panelId: string, size: number) => void;
	readonly onResize?: ((panelId: string, size: number) => void) | undefined;
}

function updatePanels(params: UpdatePanelsParams): void {
	const { panel, nextPanel, newPanelSize, newNextPanelSize, orientation, setPanelSize, onResize } =
		params;
	setDimension(orientation, panel.element, newPanelSize);
	setDimension(orientation, nextPanel.element, newNextPanelSize);
	setPanelSize(panel.id, newPanelSize);
	setPanelSize(nextPanel.id, newNextPanelSize);
	onResize?.(panel.id, newPanelSize);
	onResize?.(nextPanel.id, newNextPanelSize);
}

function canStartResize(disabled: boolean, panelIndex: number, panelRefsLength: number): boolean {
	return !disabled && panelIndex >= 0 && panelIndex < panelRefsLength - 1;
}

function getStartPosition(
	orientation: SplitterOrientation,
	event: ReactMouseEvent<HTMLButtonElement>
): number {
	return isHorizontal(orientation) ? event.clientX : event.clientY;
}

export function processMouseMove(event: MouseEvent, context: MouseMoveContext): void {
	const { resizeState, panelRefs, orientation, sizeGetters, setPanelSize, onResize } = context;
	const { isResizing, panelIndex, startPos, startSizes } = resizeState;
	if (!isResizing || panelIndex < 0) {
		return;
	}

	const panel = panelRefs[panelIndex];
	const nextPanel = panelRefs[panelIndex + 1];
	if (!panel || !nextPanel) {
		return;
	}

	const startSize = startSizes[panelIndex] ?? 0;
	const delta = calculateNewSize({ event, orientation, startPos, startSize }) - startSize;
	const { newPanelSize, newNextPanelSize } = calculatePanelSizes(
		delta,
		{ panel, nextPanel, orientation },
		getPanelConstraints(panel, nextPanel, sizeGetters)
	);

	updatePanels({
		panel,
		nextPanel,
		newPanelSize,
		newNextPanelSize,
		orientation,
		setPanelSize,
		onResize,
	});
}

export function processMouseDown(
	event: ReactMouseEvent<HTMLButtonElement>,
	panelIndex: number,
	context: MouseDownContext
): void {
	const { disabled, panelRefs, orientation, setResizeState } = context;
	if (!canStartResize(disabled, panelIndex, panelRefs.length)) {
		return;
	}

	event.preventDefault();
	event.stopPropagation();

	const panel = panelRefs[panelIndex];
	const nextPanel = panelRefs[panelIndex + 1];
	if (!panel || !nextPanel) {
		return;
	}

	const startPos = getStartPosition(orientation, event);
	const startSizes = panelRefs.map(p => getDimension(orientation, p.element));

	setResizeState({
		isResizing: true,
		panelIndex,
		startPos,
		startSizes,
	});
}
