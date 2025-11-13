import ErrorText from '@core/ui/error-text/ErrorText';
import HelperText from '@core/ui/helper-text/HelperText';

import type { ColorPickerMessagesProps } from './ColorPickerTypes';

export function ColorPickerMessages({
	colorPickerId,
	error,
	helperText,
}: Readonly<ColorPickerMessagesProps>) {
	return (
		<>
			{error ? (
				<ErrorText id={`${colorPickerId}-error`} size="sm">
					{error}
				</ErrorText>
			) : null}
			{helperText ? (
				<HelperText id={`${colorPickerId}-helper`} size="sm">
					{helperText}
				</HelperText>
			) : null}
		</>
	);
}
