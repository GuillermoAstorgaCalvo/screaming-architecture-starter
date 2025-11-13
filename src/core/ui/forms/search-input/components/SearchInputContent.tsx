import { SearchInputField } from '@core/ui/forms/search-input/components/SearchInputField';
import { SearchInputLabel } from '@core/ui/forms/search-input/components/SearchInputLabel';
import { SearchInputMessages } from '@core/ui/forms/search-input/components/SearchInputMessages';
import { SearchInputWrapper } from '@core/ui/forms/search-input/components/SearchInputWrapper';
import type { SearchInputContentProps } from '@core/ui/forms/search-input/types/SearchInputTypes';

export function SearchInputContent({
	state,
	fieldProps,
	label,
	error,
	helperText,
	required,
	fullWidth,
}: Readonly<SearchInputContentProps>) {
	return (
		<SearchInputWrapper fullWidth={fullWidth}>
			{label && state.finalId ? (
				<SearchInputLabel id={state.finalId} label={label} required={required} />
			) : null}
			<SearchInputField {...fieldProps} />
			{state.finalId ? (
				<SearchInputMessages inputId={state.finalId} error={error} helperText={helperText} />
			) : null}
		</SearchInputWrapper>
	);
}
