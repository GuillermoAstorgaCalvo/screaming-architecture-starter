import type { SignaturePadMessagesProps } from '@core/ui/media/signature-pad/types/SignaturePadTypes';

export function SignaturePadMessages({
	signaturePadId,
	error,
	helperText,
}: Readonly<SignaturePadMessagesProps>) {
	if (!error && !helperText) return null;

	return (
		<div className="mt-1">
			{error ? (
				<p id={`${signaturePadId}-error`} className="text-sm text-destructive">
					{error}
				</p>
			) : null}
			{helperText && !error ? (
				<p id={`${signaturePadId}-helper`} className="text-sm text-text-muted">
					{helperText}
				</p>
			) : null}
		</div>
	);
}
