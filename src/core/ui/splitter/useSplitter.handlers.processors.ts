import type { MouseEvent as ReactMouseEvent } from 'react';

import { calculatePanelSizes, getPanelConstraints } from './useSplitter.handlers.calculations';
import type { MouseDownContext, MouseMoveContext } from './useSplitter.handlers.types';
import { calculateNewSize, getDimension, isHorizontal, setDimension } from './useSplitter.helpers';

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
	const delta =
		calculateNewSize({
			event,
			orientation,
			startPos,
			startSize,
		}) - startSize;

	const constraints = getPanelConstraints(panel, nextPanel, sizeGetters);
	const panelParams = { panel, nextPanel, orientation };
	const { newPanelSize, newNextPanelSize } = calculatePanelSizes(delta, panelParams, constraints);

	setDimension(orientation, panel.element, newPanelSize);
	setDimension(orientation, nextPanel.element, newNextPanelSize);

	setPanelSize(panel.id, newPanelSize);
	setPanelSize(nextPanel.id, newNextPanelSize);

	onResize?.(panel.id, newPanelSize);
	onResize?.(nextPanel.id, newNextPanelSize);
}

export function processMouseDown(
	event: ReactMouseEvent<HTMLButtonElement>,
	panelIndex: number,
	context: MouseDownContext
): void {
	const { disabled, panelRefs, orientation, setResizeState } = context;
	if (disabled || panelIndex < 0 || panelIndex >= panelRefs.length - 1) {
		return;
	}

	event.preventDefault();
	event.stopPropagation();

	const panel = panelRefs[panelIndex];
	const nextPanel = panelRefs[panelIndex + 1];

	if (!panel || !nextPanel) {
		return;
	}

	const startPos = isHorizontal(orientation) ? event.clientX : event.clientY;
	const startSizes = panelRefs.map(p => getDimension(orientation, p.element));

	setResizeState({
		isResizing: true,
		panelIndex,
		startPos,
		startSizes,
	});
}
