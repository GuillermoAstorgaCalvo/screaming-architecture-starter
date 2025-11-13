import { extractSearchInputProps } from '@core/ui/forms/search-input/hooks/useSearchInputProps.extract';
import {
	buildFieldProps,
	shouldShowClearButton,
} from '@core/ui/forms/search-input/hooks/useSearchInputProps.helpers';
import { useSearchInputState } from '@core/ui/forms/search-input/hooks/useSearchInputState';
import type {
	SearchInputFieldProps,
	UseSearchInputStateReturn,
} from '@core/ui/forms/search-input/types/SearchInputTypes';
import type { SearchInputProps } from '@src-types/ui/forms-inputs';

export interface UseSearchInputPropsOptions {
	readonly props: Readonly<SearchInputProps>;
}

export interface UseSearchInputPropsReturn {
	readonly state: UseSearchInputStateReturn;
	readonly fieldProps: Readonly<SearchInputFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}

/**
 * Hook to process SearchInput component props and return state and field props
 *
 * Extracts and processes SearchInput component props, computes state using
 * useSearchInputState, and builds field props. Returns all necessary data
 * for rendering the SearchInput component including label, error, helper text,
 * and layout options.
 *
 * @param options - Options containing SearchInput component props
 * @returns Processed state, field props, and extracted props
 */
export function useSearchInputProps({
	props,
}: Readonly<UseSearchInputPropsOptions>): UseSearchInputPropsReturn {
	const extracted = extractSearchInputProps(props);

	const showClearButton = shouldShowClearButton(
		extracted.value,
		extracted.defaultValue,
		extracted.showClearButtonProp
	);

	const state = useSearchInputState({
		inputId: extracted.inputId,
		label: extracted.label,
		error: extracted.error,
		helperText: extracted.helperText,
		size: extracted.size,
		className: extracted.className,
		hasClearButton: showClearButton,
	});

	const fieldProps = buildFieldProps({
		state,
		extracted,
		showClearButton,
		onChange: extracted.onChange,
	});

	return {
		state,
		fieldProps,
		label: extracted.label,
		error: extracted.error,
		helperText: extracted.helperText,
		required: extracted.required,
		fullWidth: extracted.fullWidth,
	};
}
