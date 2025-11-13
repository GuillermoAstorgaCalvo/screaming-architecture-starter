import type {
	PanelConstraints,
	PanelRef,
	PanelSizeParams,
	SizeGetters,
} from './useSplitter.handlers.types';
import { applySizeConstraints, getDimension } from './useSplitter.helpers';

export function getPanelConstraints(
	panel: PanelRef,
	nextPanel: PanelRef,
	sizeGetters: SizeGetters
): PanelConstraints {
	return {
		panelMinSize: sizeGetters.getPanelMinSize(panel.id),
		panelMaxSize: sizeGetters.getPanelMaxSize(panel.id),
		nextPanelMinSize: sizeGetters.getPanelMinSize(nextPanel.id),
		nextPanelMaxSize: sizeGetters.getPanelMaxSize(nextPanel.id),
	};
}

export function calculatePanelSizes(
	delta: number,
	params: PanelSizeParams,
	constraints: PanelConstraints
): { newPanelSize: number; newNextPanelSize: number } {
	const { panel, nextPanel, orientation } = params;
	const currentPanelSize = getDimension(orientation, panel.element);
	const currentNextPanelSize = getDimension(orientation, nextPanel.element);

	let newPanelSize = currentPanelSize + delta;
	let newNextPanelSize = currentNextPanelSize - delta;

	// Apply constraints
	newPanelSize = applySizeConstraints(
		newPanelSize,
		constraints.panelMinSize,
		constraints.panelMaxSize
	);
	newNextPanelSize = applySizeConstraints(
		newNextPanelSize,
		constraints.nextPanelMinSize,
		constraints.nextPanelMaxSize
	);

	// Adjust if constraints were applied
	const totalSize = currentPanelSize + currentNextPanelSize;
	const adjustedTotal = newPanelSize + newNextPanelSize;
	if (adjustedTotal !== totalSize) {
		const diff = totalSize - adjustedTotal;
		if (
			newPanelSize === constraints.panelMinSize ||
			(constraints.panelMaxSize && newPanelSize === constraints.panelMaxSize)
		) {
			newNextPanelSize += diff;
		} else {
			newPanelSize += diff;
		}
	}

	return { newPanelSize, newNextPanelSize };
}
