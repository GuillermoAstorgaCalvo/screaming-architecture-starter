import { useTranslation } from '@core/i18n/useTranslation';
import Dialog from '@core/ui/dialog/Dialog';
import { usePromptDialogState } from '@core/ui/overlays/prompt-dialog/hooks/PromptDialogHooks';
import type { PromptDialogProps } from '@core/ui/overlays/prompt-dialog/types/PromptDialogTypes';
import { buildPromptDialogProps } from '@core/ui/overlays/prompt-dialog/utils/buildPromptDialogProps';
import { normalizePromptDialogProps } from '@core/ui/overlays/prompt-dialog/utils/normalizePromptDialogProps';

export type {
	PromptDialogInputType,
	PromptDialogProps,
	PromptDialogVariant,
} from '@core/ui/overlays/prompt-dialog/types/PromptDialogTypes';

/**
 * PromptDialog - Dialog that prompts for text input
 *
 * Features:
 * - Accessible: proper ARIA attributes
 * - Input validation support
 * - Required field validation
 * - Focus management and keyboard navigation
 * - Dark mode support
 * - Supports different variants (default, centered, fullscreen)
 * - Supports different input types (text, email, password, number, tel, url)
 *
 * @example
 * ```tsx
 * <PromptDialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Enter Name"
 *   label="Name"
 *   placeholder="Enter your name"
 *   onConfirm={(value) => console.log(value)}
 *   required
 * />
 * ```
 *
 * @example
 * ```tsx
 * <PromptDialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Enter Email"
 *   label="Email"
 *   inputType="email"
 *   validate={(value) => {
 *     if (!value.includes('@')) {
 *       return 'Please enter a valid email address';
 *     }
 *   }}
 *   onConfirm={(value) => handleEmailSubmit(value)}
 * />
 * ```
 */
export default function PromptDialog(props: Readonly<PromptDialogProps>) {
	const { t } = useTranslation('common');
	// Apply i18n defaults before normalization
	const propsWithDefaults: PromptDialogProps = {
		...props,
		confirmLabel: props.confirmLabel ?? t('confirm'),
		cancelLabel: props.cancelLabel ?? t('cancel'),
		label: props.label ?? t('input'),
	};
	const normalizedProps = normalizePromptDialogProps(propsWithDefaults);
	const state = usePromptDialogState({
		defaultValue: normalizedProps.defaultValue,
		onClose: normalizedProps.onClose,
		validate: normalizedProps.validate,
		required: normalizedProps.required,
		onConfirm: normalizedProps.onConfirm,
		onCancel: normalizedProps.onCancel,
	});
	const dialogProps = buildPromptDialogProps(normalizedProps, state);
	return <Dialog {...dialogProps} />;
}
