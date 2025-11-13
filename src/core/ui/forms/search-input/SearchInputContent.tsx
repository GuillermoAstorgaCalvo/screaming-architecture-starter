import { SearchInputField } from './SearchInputField';
import { SearchInputLabel } from './SearchInputLabel';
import { SearchInputMessages } from './SearchInputMessages';
import type { SearchInputContentProps } from './SearchInputTypes';
import { SearchInputWrapper } from './SearchInputWrapper';

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
