import type { InlineEditProps } from '@src-types/ui/forms-inputs';
import type { ChangeEvent, FocusEvent, KeyboardEvent, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { getDisplayContent } from './InlineEditHelpers';

export interface EditInputOptions {
	readonly id: string;
	readonly editValue: string;
	readonly inputClasses: string;
	readonly placeholder: string;
	readonly disabled: boolean;
	readonly handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
	readonly handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
	readonly handleBlur: (e: FocusEvent<HTMLInputElement>) => void;
	readonly inputProps: Readonly<
		Omit<
			InlineEditProps,
			| 'value'
			| 'defaultValue'
			| 'onSave'
			| 'onCancel'
			| 'onChange'
			| 'placeholder'
			| 'size'
			| 'disabled'
			| 'displayClassName'
			| 'inputClassName'
			| 'showEmptyPlaceholder'
			| 'renderDisplay'
		>
	>;
}

/**
 * Render input field in edit mode
 */
export function renderEditInput(options: Readonly<EditInputOptions>) {
	const {
		id,
		editValue,
		inputClasses,
		placeholder,
		disabled,
		handleChange,
		handleKeyDown,
		handleBlur,
		inputProps,
	} = options;
	return (
		<input
			id={id}
			type="text"
			value={editValue}
			onChange={handleChange}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
			className={inputClasses}
			disabled={disabled}
			aria-label={placeholder}
			{...inputProps}
		/>
	);
}

export interface RenderDisplayButtonOptions {
	readonly displayContent: ReactNode;
	readonly displayClasses: string;
	readonly placeholder: string;
	readonly disabled: boolean;
	readonly handleDisplayClick: () => void;
	readonly handleDisplayKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
}

/**
 * Render display button in view mode
 */
export function renderDisplayButton(options: Readonly<RenderDisplayButtonOptions>) {
	const {
		displayContent,
		displayClasses,
		placeholder,
		disabled,
		handleDisplayClick,
		handleDisplayKeyDown,
	} = options;

	return (
		<button
			type="button"
			disabled={disabled}
			aria-label={placeholder}
			onClick={handleDisplayClick}
			onKeyDown={handleDisplayKeyDown}
			className={twMerge(displayClasses, 'text-left bg-transparent border-none p-0')}
		>
			{displayContent}
		</button>
	);
}

export interface RenderEditModeOptions {
	readonly id: string;
	readonly editValue: string;
	readonly inputClasses: string;
	readonly placeholder: string;
	readonly disabled: boolean;
	readonly handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
	readonly handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
	readonly handleBlur: (e: FocusEvent<HTMLInputElement>) => void;
	readonly inputProps: Readonly<
		Omit<
			InlineEditProps,
			| 'value'
			| 'defaultValue'
			| 'onSave'
			| 'onCancel'
			| 'onChange'
			| 'placeholder'
			| 'size'
			| 'disabled'
			| 'displayClassName'
			| 'inputClassName'
			| 'showEmptyPlaceholder'
			| 'renderDisplay'
		>
	>;
}

/**
 * Render edit mode input
 */
export function renderEditMode(options: Readonly<RenderEditModeOptions>) {
	return renderEditInput(options);
}

export interface RenderViewModeOptions {
	readonly isEmpty: boolean;
	readonly showEmptyPlaceholder: boolean;
	readonly placeholder: string;
	readonly displayValue: string;
	readonly renderDisplay?: ((value: string) => ReactNode) | undefined;
	readonly displayClasses: string;
	readonly disabled: boolean;
	readonly handleDisplayClick: () => void;
	readonly handleDisplayKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
}

/**
 * Render view mode display button
 */
export function renderViewMode(options: Readonly<RenderViewModeOptions>) {
	const {
		isEmpty,
		showEmptyPlaceholder,
		placeholder,
		displayValue,
		renderDisplay,
		displayClasses,
		disabled,
		handleDisplayClick,
		handleDisplayKeyDown,
	} = options;

	const displayContent = getDisplayContent({
		isEmpty,
		showEmptyPlaceholder,
		placeholder,
		displayValue,
		renderDisplay,
	});

	return renderDisplayButton({
		displayContent,
		displayClasses,
		placeholder,
		disabled,
		handleDisplayClick,
		handleDisplayKeyDown,
	});
}
