import { AlertDialogShowcase } from './dialogs/AlertDialogShowcase';
import { ConfirmDialogShowcase } from './dialogs/ConfirmDialogShowcase';
import { DialogShowcase } from './dialogs/DialogShowcase';
import { ModalShowcase } from './dialogs/ModalShowcase';
import { PromptDialogShowcase } from './dialogs/PromptDialogShowcase';
import type { OverlaySetters, OverlayState } from './types/types';

export function renderDialogs(state: OverlayState, setters: OverlaySetters) {
	return (
		<div className="space-y-8">
			<DialogShowcase
				isOpen={state.dialogOpen}
				onOpen={() => setters.setDialogOpen(true)}
				onClose={() => setters.setDialogOpen(false)}
			/>
			<ModalShowcase
				isOpen={state.modalOpen}
				onOpen={() => setters.setModalOpen(true)}
				onClose={() => setters.setModalOpen(false)}
			/>
			<AlertDialogShowcase
				isOpen={state.alertDialogOpen}
				onOpen={() => setters.setAlertDialogOpen(true)}
				onClose={() => setters.setAlertDialogOpen(false)}
			/>
			<ConfirmDialogShowcase
				isOpen={state.confirmDialogOpen}
				onOpen={() => setters.setConfirmDialogOpen(true)}
				onClose={() => setters.setConfirmDialogOpen(false)}
			/>
			<PromptDialogShowcase
				isOpen={state.promptDialogOpen}
				onOpen={() => setters.setPromptDialogOpen(true)}
				onClose={() => setters.setPromptDialogOpen(false)}
			/>
		</div>
	);
}
