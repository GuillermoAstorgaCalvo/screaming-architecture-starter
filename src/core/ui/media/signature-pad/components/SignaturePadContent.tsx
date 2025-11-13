import { SignaturePadCanvas } from '@core/ui/media/signature-pad/components/SignaturePadCanvas';
import { SignaturePadLabel } from '@core/ui/media/signature-pad/components/SignaturePadLabel';
import { SignaturePadMessages } from '@core/ui/media/signature-pad/components/SignaturePadMessages';
import { SignaturePadWrapper } from '@core/ui/media/signature-pad/components/SignaturePadWrapper';
import type { SignaturePadContentProps } from '@core/ui/media/signature-pad/types/SignaturePadTypes';

export function SignaturePadContent({
	state,
	canvasProps,
	label,
	error,
	helperText,
	required,
	fullWidth,
	showClearButton = true,
	clearButtonText = 'Clear',
	onClear,
	...props
}: Readonly<SignaturePadContentProps>) {
	return (
		<SignaturePadWrapper fullWidth={fullWidth} {...props}>
			{label && state.finalId ? (
				<SignaturePadLabel id={state.finalId} label={label} required={required} />
			) : null}
			<SignaturePadCanvas
				{...canvasProps}
				showClearButton={showClearButton}
				clearButtonText={clearButtonText}
				{...(onClear && { onClear })}
			/>
			{state.finalId ? (
				<SignaturePadMessages
					signaturePadId={state.finalId}
					error={error}
					helperText={helperText}
				/>
			) : null}
		</SignaturePadWrapper>
	);
}
