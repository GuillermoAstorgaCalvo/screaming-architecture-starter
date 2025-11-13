import {
	createDisplayHandlers,
	useFocusInput,
} from '@core/ui/forms/inline-edit/helpers/InlineEditHandlers';
import {
	buildHookOptions,
	computeValues,
} from '@core/ui/forms/inline-edit/helpers/InlineEditHelpers';
import { useInlineEdit } from '@core/ui/forms/inline-edit/hooks/useInlineEdit';
import type { InlineEditProps } from '@src-types/ui/forms-inputs';
import type { ChangeEvent, FocusEvent, KeyboardEvent, RefObject } from 'react';

export interface UseInlineEditSetupOptions {
	readonly controlledValue?: string | undefined;
	readonly defaultValue?: string | undefined;
	readonly onSave?: ((value: string) => void) | undefined;
	readonly onCancel?: (() => void) | undefined;
	readonly onChange?: ((value: string) => void) | undefined;
	readonly size: 'sm' | 'md' | 'lg';
	readonly disabled: boolean;
	readonly displayClassName?: string | undefined;
	readonly inputClassName?: string | undefined;
	readonly inputRef: RefObject<HTMLInputElement | null>;
	readonly startEditing: () => void;
}

export interface InlineEditSetup {
	readonly isEditing: boolean;
	readonly editValue: string;
	readonly displayValue: string;
	readonly isEmpty: boolean;
	readonly displayClasses: string;
	readonly inputClasses: string;
	readonly focusInput: () => void;
	readonly handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
	readonly handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
	readonly handleBlur: (e: FocusEvent<HTMLInputElement>) => void;
	readonly handleDisplayClick: () => void;
	readonly handleDisplayKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
}

/**
 * Setup inline edit hook and get editing state
 */
function useInlineEditState(options: Readonly<UseInlineEditSetupOptions>) {
	const { controlledValue, defaultValue, onSave, onCancel, onChange } = options;
	const hookOptions = buildHookOptions({
		value: controlledValue,
		defaultValue,
		onSave,
		onCancel,
		onChange,
	} as Readonly<InlineEditProps>);

	return useInlineEdit(hookOptions);
}

/**
 * Get computed display and input values
 */
function getComputedValues(options: Readonly<UseInlineEditSetupOptions>) {
	const { controlledValue, defaultValue, size, disabled, displayClassName, inputClassName } =
		options;
	return computeValues({
		controlledValue,
		defaultValue,
		size,
		disabled,
		displayClassName,
		inputClassName,
	});
}

/**
 * Setup hook and compute all derived values and handlers
 */
export function useInlineEditSetup(options: Readonly<UseInlineEditSetupOptions>): InlineEditSetup {
	const { inputRef, startEditing, disabled } = options;

	const { isEditing, editValue, handleChange, handleKeyDown, handleBlur } =
		useInlineEditState(options);

	const { displayValue, isEmpty, displayClasses, inputClasses } = getComputedValues(options);

	const focusInput = useFocusInput(inputRef);
	const { handleDisplayClick, handleDisplayKeyDown } = createDisplayHandlers({
		disabled,
		startEditing,
		focusInput,
	});

	return {
		isEditing,
		editValue,
		displayValue,
		isEmpty,
		displayClasses,
		inputClasses,
		focusInput,
		handleChange,
		handleKeyDown,
		handleBlur,
		handleDisplayClick,
		handleDisplayKeyDown,
	};
}

export interface CreateSetupOptionsParams {
	readonly controlledValue?: string | undefined;
	readonly defaultValue?: string | undefined;
	readonly onSave?: ((value: string) => void) | undefined;
	readonly onCancel?: (() => void) | undefined;
	readonly onChange?: ((value: string) => void) | undefined;
	readonly size: 'sm' | 'md' | 'lg';
	readonly disabled: boolean;
	readonly displayClassName?: string | undefined;
	readonly inputClassName?: string | undefined;
	readonly inputRef: RefObject<HTMLInputElement | null>;
	readonly startEditing: () => void;
}

/**
 * Create setup options for useInlineEditSetup
 */
export function createSetupOptions(
	params: Readonly<CreateSetupOptionsParams>
): Readonly<UseInlineEditSetupOptions> {
	return {
		controlledValue: params.controlledValue,
		defaultValue: params.defaultValue,
		onSave: params.onSave,
		onCancel: params.onCancel,
		onChange: params.onChange,
		size: params.size,
		disabled: params.disabled,
		displayClassName: params.displayClassName,
		inputClassName: params.inputClassName,
		inputRef: params.inputRef,
		startEditing: params.startEditing,
	};
}

/**
 * Initialize inline edit hook and get startEditing function
 */
export function useStartEditing(props: Readonly<InlineEditProps>) {
	const hookOptions = buildHookOptions(props);
	const { startEditing } = useInlineEdit(hookOptions);
	return startEditing;
}

/**
 * Get setup configuration for inline edit
 */
export function getSetupConfig(
	props: Readonly<InlineEditProps>,
	inputRef: RefObject<HTMLInputElement | null>,
	startEditing: () => void
): Readonly<UseInlineEditSetupOptions> {
	return createSetupOptions({
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
	});
}
