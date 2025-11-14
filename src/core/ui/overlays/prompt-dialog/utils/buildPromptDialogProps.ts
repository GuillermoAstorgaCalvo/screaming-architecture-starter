import type { PromptDialogState } from '@core/ui/overlays/prompt-dialog/hooks/PromptDialogHooks';
import type { NormalizedPromptDialogProps } from '@core/ui/overlays/prompt-dialog/types/PromptDialogTypes';
import { preparePromptDialog } from '@core/ui/overlays/prompt-dialog/utils/promptDialogFactories';

export function buildPromptDialogProps(
	normalizedProps: NormalizedPromptDialogProps,
	state: PromptDialogState
) {
	return preparePromptDialog({
		label: normalizedProps.label,
		inputType: normalizedProps.inputType,
		value: state.value,
		handleValueChange: state.handleValueChange,
		placeholder: normalizedProps.placeholder,
		required: normalizedProps.required,
		error: state.error,
		cancelLabel: normalizedProps.cancelLabel,
		confirmLabel: normalizedProps.confirmLabel,
		handleCancel: state.handleCancel,
		handleConfirm: state.handleConfirm,
		isOpen: normalizedProps.isOpen,
		onClose: state.handleClose,
		title: normalizedProps.title,
		size: normalizedProps.size,
		variant: normalizedProps.variant,
		className: normalizedProps.className,
	});
}
