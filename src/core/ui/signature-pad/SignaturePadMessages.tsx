import type { SignaturePadMessagesProps } from './SignaturePadTypes';

export function SignaturePadMessages({
	signaturePadId,
	error,
	helperText,
}: Readonly<SignaturePadMessagesProps>) {
	if (!error && !helperText) return null;

	return (
		<div className="mt-1">
			{error ? (
				<p id={`${signaturePadId}-error`} className="text-sm text-red-600 dark:text-red-400">
					{error}
				</p>
			) : null}
			{helperText && !error ? (
				<p id={`${signaturePadId}-helper`} className="text-sm text-gray-500 dark:text-gray-400">
					{helperText}
				</p>
			) : null}
		</div>
	);
}
