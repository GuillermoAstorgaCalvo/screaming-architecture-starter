import {
	generateEditorId,
	getAriaDescribedBy,
	getRichTextEditorClasses,
} from '@core/ui/forms/rich-text-editor/helpers/RichTextEditorHelpers';
import type {
	RichTextEditorFieldProps,
	UseRichTextEditorStateOptions,
	UseRichTextEditorStateReturn,
} from '@core/ui/forms/rich-text-editor/types/RichTextEditorTypes';
import type { RichTextEditorProps } from '@src-types/ui/forms-editors';
import { useId } from 'react';

export interface UseRichTextEditorPropsOptions {
	readonly props: Readonly<RichTextEditorProps>;
}

export interface UseRichTextEditorPropsReturn {
	readonly state: UseRichTextEditorStateReturn;
	readonly editorProps: Readonly<RichTextEditorFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}

interface NormalizedRichTextEditorProps {
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: 'sm' | 'md' | 'lg';
	readonly fullWidth: boolean;
	readonly editorId?: string | undefined;
	readonly className?: string | undefined;
	readonly value?: string | undefined;
	readonly defaultValue?: string | undefined;
	readonly onChange?: ((html: string) => void) | undefined;
	readonly placeholder?: string | undefined;
	readonly disabled: boolean;
	readonly readOnly: boolean;
	readonly minHeight?: number | string | undefined;
	readonly maxHeight?: number | string | undefined;
	readonly extensions?: unknown[] | undefined;
	readonly toolbar?: RichTextEditorProps['toolbar'] | undefined;
	readonly required?: boolean | undefined;
}

function normalizeRichTextEditorProps(
	props: Readonly<RichTextEditorProps>
): NormalizedRichTextEditorProps {
	// Handle 'required' which may come from HTMLAttributes but isn't explicitly in RichTextEditorProps
	const required: boolean | undefined =
		'required' in props ? (props.required as boolean | undefined) : undefined;

	return {
		label: props.label,
		error: props.error,
		helperText: props.helperText,
		size: props.size ?? 'md',
		fullWidth: props.fullWidth ?? false,
		editorId: props.editorId,
		className: props.className,
		value: props.value,
		defaultValue: props.defaultValue,
		onChange: props.onChange,
		placeholder: props.placeholder,
		disabled: props.disabled ?? false,
		readOnly: props.readOnly ?? false,
		minHeight: props.minHeight,
		maxHeight: props.maxHeight,
		extensions: props.extensions,
		toolbar: props.toolbar,
		required,
	};
}

function buildRichTextEditorFieldProps(
	normalizedProps: NormalizedRichTextEditorProps,
	state: UseRichTextEditorStateReturn
): RichTextEditorFieldProps {
	return {
		id: state.finalId,
		className: state.editorClasses,
		hasError: state.hasError,
		ariaDescribedBy: state.ariaDescribedBy,
		disabled: normalizedProps.disabled,
		...(normalizedProps.required !== undefined && { required: normalizedProps.required }),
		...(normalizedProps.value !== undefined && { value: normalizedProps.value }),
		...(normalizedProps.defaultValue !== undefined && {
			defaultValue: normalizedProps.defaultValue,
		}),
		...(normalizedProps.onChange !== undefined && { onChange: normalizedProps.onChange }),
		...(normalizedProps.placeholder !== undefined && { placeholder: normalizedProps.placeholder }),
		readOnly: normalizedProps.readOnly,
		...(normalizedProps.minHeight !== undefined && { minHeight: normalizedProps.minHeight }),
		...(normalizedProps.maxHeight !== undefined && { maxHeight: normalizedProps.maxHeight }),
		...(normalizedProps.extensions !== undefined && { extensions: normalizedProps.extensions }),
		...(normalizedProps.toolbar !== undefined && { toolbar: normalizedProps.toolbar }),
	};
}

export function useRichTextEditorState({
	editorId,
	label,
	error,
	helperText,
	size,
	className,
}: Readonly<UseRichTextEditorStateOptions>): UseRichTextEditorStateReturn {
	const generatedId = useId();
	const finalId = generateEditorId(generatedId, editorId, label);
	const hasError = Boolean(error);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;
	const editorClasses = getRichTextEditorClasses(size, hasError, className);
	return { finalId, hasError, ariaDescribedBy, editorClasses };
}

export function useRichTextEditorProps({
	props,
}: Readonly<UseRichTextEditorPropsOptions>): UseRichTextEditorPropsReturn {
	const normalizedProps = normalizeRichTextEditorProps(props);

	const state = useRichTextEditorState({
		editorId: normalizedProps.editorId,
		label: normalizedProps.label,
		error: normalizedProps.error,
		helperText: normalizedProps.helperText,
		size: normalizedProps.size,
		className: normalizedProps.className,
	});

	const editorProps = buildRichTextEditorFieldProps(normalizedProps, state);

	return {
		state,
		editorProps,
		label: normalizedProps.label,
		error: normalizedProps.error,
		helperText: normalizedProps.helperText,
		required: normalizedProps.required,
		fullWidth: normalizedProps.fullWidth,
	};
}
