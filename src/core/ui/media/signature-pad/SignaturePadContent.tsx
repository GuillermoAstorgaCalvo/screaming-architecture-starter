import { SignaturePadCanvas } from './SignaturePadCanvas';
import { SignaturePadLabel } from './SignaturePadLabel';
import { SignaturePadMessages } from './SignaturePadMessages';
import type { SignaturePadContentProps } from './SignaturePadTypes';
import { SignaturePadWrapper } from './SignaturePadWrapper';

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
