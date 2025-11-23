import { useState } from 'react';

import type { OverlaySetters, OverlayState } from './types/types';

/**
 * Creates dialog-related overlay states
 */
function useDialogStates() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [alertDialogOpen, setAlertDialogOpen] = useState(false);
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [promptDialogOpen, setPromptDialogOpen] = useState(false);

	return {
		dialog: { value: dialogOpen, setValue: setDialogOpen },
		modal: { value: modalOpen, setValue: setModalOpen },
		alertDialog: { value: alertDialogOpen, setValue: setAlertDialogOpen },
		confirmDialog: { value: confirmDialogOpen, setValue: setConfirmDialogOpen },
		promptDialog: { value: promptDialogOpen, setValue: setPromptDialogOpen },
	};
}

/**
 * Creates panel-related overlay states
 */
function usePanelStates() {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [sheetOpen, setSheetOpen] = useState(false);

	return {
		drawer: { value: drawerOpen, setValue: setDrawerOpen },
		sheet: { value: sheetOpen, setValue: setSheetOpen },
	};
}

/**
 * Creates popover-related overlay states
 */
function usePopoverStates() {
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [popconfirmOpen, setPopconfirmOpen] = useState(false);

	return {
		popover: { value: popoverOpen, setValue: setPopoverOpen },
		popconfirm: { value: popconfirmOpen, setValue: setPopconfirmOpen },
	};
}

/**
 * Creates specialized overlay states
 */
function useSpecializedStates() {
	const [actionSheetOpen, setActionSheetOpen] = useState(false);
	const [backdropOpen, setBackdropOpen] = useState(false);
	const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

	return {
		actionSheet: { value: actionSheetOpen, setValue: setActionSheetOpen },
		backdrop: { value: backdropOpen, setValue: setBackdropOpen },
		commandPalette: { value: commandPaletteOpen, setValue: setCommandPaletteOpen },
	};
}

/**
 * Composes all overlay states into the expected format
 */
function composeOverlayState(
	dialogStates: ReturnType<typeof useDialogStates>,
	panelStates: ReturnType<typeof usePanelStates>,
	popoverStates: ReturnType<typeof usePopoverStates>,
	specializedStates: ReturnType<typeof useSpecializedStates>
): OverlayState {
	return {
		dialogOpen: dialogStates.dialog.value,
		modalOpen: dialogStates.modal.value,
		drawerOpen: panelStates.drawer.value,
		popoverOpen: popoverStates.popover.value,
		alertDialogOpen: dialogStates.alertDialog.value,
		actionSheetOpen: specializedStates.actionSheet.value,
		backdropOpen: specializedStates.backdrop.value,
		commandPaletteOpen: specializedStates.commandPalette.value,
		confirmDialogOpen: dialogStates.confirmDialog.value,
		popconfirmOpen: popoverStates.popconfirm.value,
		promptDialogOpen: dialogStates.promptDialog.value,
		sheetOpen: panelStates.sheet.value,
	};
}

/**
 * Composes all overlay setters into the expected format
 */
function composeOverlaySetters(
	dialogStates: ReturnType<typeof useDialogStates>,
	panelStates: ReturnType<typeof usePanelStates>,
	popoverStates: ReturnType<typeof usePopoverStates>,
	specializedStates: ReturnType<typeof useSpecializedStates>
): OverlaySetters {
	return {
		setDialogOpen: dialogStates.dialog.setValue,
		setModalOpen: dialogStates.modal.setValue,
		setDrawerOpen: panelStates.drawer.setValue,
		setPopoverOpen: popoverStates.popover.setValue,
		setAlertDialogOpen: dialogStates.alertDialog.setValue,
		setActionSheetOpen: specializedStates.actionSheet.setValue,
		setBackdropOpen: specializedStates.backdrop.setValue,
		setCommandPaletteOpen: specializedStates.commandPalette.setValue,
		setConfirmDialogOpen: dialogStates.confirmDialog.setValue,
		setPopconfirmOpen: popoverStates.popconfirm.setValue,
		setPromptDialogOpen: dialogStates.promptDialog.setValue,
		setSheetOpen: panelStates.sheet.setValue,
	};
}

/**
 * useOverlayState - Custom hook for managing shared state across overlay showcases
 */
export function useOverlayState() {
	const dialogStates = useDialogStates();
	const panelStates = usePanelStates();
	const popoverStates = usePopoverStates();
	const specializedStates = useSpecializedStates();

	const state = composeOverlayState(dialogStates, panelStates, popoverStates, specializedStates);
	const setters = composeOverlaySetters(
		dialogStates,
		panelStates,
		popoverStates,
		specializedStates
	);

	return { state, setters };
}
