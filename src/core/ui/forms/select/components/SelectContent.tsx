import { SelectField } from '@core/ui/forms/select/components/SelectField';
import { SelectLabel } from '@core/ui/forms/select/components/SelectLabel';
import { SelectMessages } from '@core/ui/forms/select/components/SelectMessages';
import { SelectWrapper } from '@core/ui/forms/select/components/SelectWrapper';
import type {
	SelectFieldProps,
	UseSelectStateReturn,
} from '@core/ui/forms/select/types/SelectTypes';

// ============================================================================
// Content Component
// ============================================================================

export interface SelectContentProps {
	readonly state: UseSelectStateReturn;
	readonly fieldProps: Readonly<SelectFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}

export function SelectContent({
	state,
	fieldProps,
	label,
	error,
	helperText,
	required,
	fullWidth,
}: Readonly<SelectContentProps>) {
	return (
		<SelectWrapper fullWidth={fullWidth}>
			{label && state.finalId ? (
				<SelectLabel id={state.finalId} label={label} required={required} />
			) : null}
			<SelectField {...fieldProps} />
			{state.finalId ? (
				<SelectMessages selectId={state.finalId} error={error} helperText={helperText} />
			) : null}
		</SelectWrapper>
	);
}
