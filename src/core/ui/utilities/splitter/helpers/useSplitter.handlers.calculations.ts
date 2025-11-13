import {
	applySizeConstraints,
	getDimension,
} from '@core/ui/utilities/splitter/helpers/useSplitter.helpers';
import type {
	PanelConstraints,
	PanelRef,
	PanelSizeParams,
	SizeGetters,
} from '@core/ui/utilities/splitter/types/useSplitter.handlers.types';

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

function adjustSizesForConstraints(params: {
	newPanelSize: number;
	newNextPanelSize: number;
	currentPanelSize: number;
	currentNextPanelSize: number;
	constraints: PanelConstraints;
}): { newPanelSize: number; newNextPanelSize: number } {
	const { newPanelSize, newNextPanelSize, currentPanelSize, currentNextPanelSize, constraints } =
		params;
	const totalSize = currentPanelSize + currentNextPanelSize;
	const adjustedTotal = newPanelSize + newNextPanelSize;
	if (adjustedTotal !== totalSize) {
		const diff = totalSize - adjustedTotal;
		if (
			newPanelSize === constraints.panelMinSize ||
			(constraints.panelMaxSize && newPanelSize === constraints.panelMaxSize)
		) {
			return { newPanelSize, newNextPanelSize: newNextPanelSize + diff };
		}
		return { newPanelSize: newPanelSize + diff, newNextPanelSize };
	}
	return { newPanelSize, newNextPanelSize };
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

	return adjustSizesForConstraints({
		newPanelSize,
		newNextPanelSize,
		currentPanelSize,
		currentNextPanelSize,
		constraints,
	});
}
