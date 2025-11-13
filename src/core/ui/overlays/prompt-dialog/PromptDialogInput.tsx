import Input from '@core/ui/input/Input';
import { type ChangeEvent, useCallback } from 'react';

import type { PromptDialogInputType } from './PromptDialog';

interface PromptDialogInputProps {
	label: string;
	type: PromptDialogInputType;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string | undefined;
	required: boolean;
	error?: string | undefined;
}

/**
 * Renders the input field for the prompt dialog
 */
export function PromptDialogInput({
	label,
	type,
	value,
	onChange,
	placeholder,
	required,
	error,
}: Readonly<PromptDialogInputProps>) {
	const handleChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			onChange(e.target.value);
		},
		[onChange]
	);

	return (
		<div className="space-y-2">
			<Input
				label={label}
				type={type}
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				required={required}
				{...(error !== undefined && { error })}
				fullWidth
			/>
		</div>
	);
}
