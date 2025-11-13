import ErrorText from '@core/ui/error-text/ErrorText';
import type { ColorPickerMessagesProps } from '@core/ui/forms/color-picker/types/ColorPickerTypes';
import HelperText from '@core/ui/helper-text/HelperText';

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
