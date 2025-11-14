import { useTranslation } from '@core/i18n/useTranslation';
import {
	renderEditInput,
	renderViewMode,
} from '@core/ui/forms/inline-edit/helpers/InlineEditRenderers';
import {
	useInlineEditSetup,
	useStartEditing,
} from '@core/ui/forms/inline-edit/helpers/InlineEditSetup';
import type { InlineEditProps } from '@src-types/ui/forms-inputs';
import { useId, useRef } from 'react';

/**
 * InlineEdit - Editable text/field component (click to edit, blur to save)
 *
 * Features:
 * - Click to edit functionality
 * - Blur to save
 * - Enter key to save
 * - Escape key to cancel
 * - Accessible: proper ARIA attributes
 * - Size variants: sm, md, lg
 * - Custom display renderer support
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <InlineEdit
 *   value={name}
 *   onSave={(value) => setName(value)}
 *   placeholder="Click to edit"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <InlineEdit
 *   value={title}
 *   onSave={(value) => updateTitle(value)}
 *   onCancel={() => console.log('Cancelled')}
 *   size="lg"
 *   renderDisplay={(value) => <strong>{value}</strong>}
 * />
 * ```
 */
function useInlineEditConfig(props: Readonly<InlineEditProps>) {
	const inputRef = useRef<HTMLInputElement>(null);
	const startEditing = useStartEditing(props);
	return {
		inputRef,
		startEditing,
		setup: useInlineEditSetup({
			controlledValue: props.value,
			defaultValue: props.defaultValue,
			onSave: props.onSave,
			onCancel: props.onCancel,
			onChange: props.onChange,
			size: props.size ?? 'md',
			disabled: props.disabled ?? false,
			displayClassName: props.displayClassName,
			inputClassName: props.inputClassName,
			inputRef,
			startEditing,
		}),
	};
}

export default function InlineEdit(props: Readonly<InlineEditProps>) {
	const { t } = useTranslation('inlineEdit');
	const { placeholder, showEmptyPlaceholder = true, renderDisplay, ...inputProps } = props;
	const defaultPlaceholder = placeholder ?? t('placeholder');
	const id = useId();
	const { setup } = useInlineEditConfig(props);
	const disabled = props.disabled ?? false;

	if (setup.isEditing) {
		return renderEditInput({
			id,
			editValue: setup.editValue,
			inputClasses: setup.inputClasses,
			placeholder: defaultPlaceholder,
			disabled,
			handleChange: setup.handleChange,
			handleKeyDown: setup.handleKeyDown,
			handleBlur: setup.handleBlur,
			inputProps,
		});
	}

	return renderViewMode({
		isEmpty: setup.isEmpty,
		showEmptyPlaceholder,
		placeholder: defaultPlaceholder,
		displayValue: setup.displayValue,
		renderDisplay,
		displayClasses: setup.displayClasses,
		disabled,
		handleDisplayClick: setup.handleDisplayClick,
		handleDisplayKeyDown: setup.handleDisplayKeyDown,
	});
}
