export interface OverlayState {
	dialogOpen: boolean;
	modalOpen: boolean;
	drawerOpen: boolean;
	popoverOpen: boolean;
	alertDialogOpen: boolean;
	actionSheetOpen: boolean;
	backdropOpen: boolean;
	commandPaletteOpen: boolean;
	confirmDialogOpen: boolean;
	popconfirmOpen: boolean;
	promptDialogOpen: boolean;
	sheetOpen: boolean;
}

export interface OverlaySetters {
	setDialogOpen: (value: boolean) => void;
	setModalOpen: (value: boolean) => void;
	setDrawerOpen: (value: boolean) => void;
	setPopoverOpen: (value: boolean) => void;
	setAlertDialogOpen: (value: boolean) => void;
	setActionSheetOpen: (value: boolean) => void;
	setBackdropOpen: (value: boolean) => void;
	setCommandPaletteOpen: (value: boolean) => void;
	setConfirmDialogOpen: (value: boolean) => void;
	setPopconfirmOpen: (value: boolean) => void;
	setPromptDialogOpen: (value: boolean) => void;
	setSheetOpen: (value: boolean) => void;
}
