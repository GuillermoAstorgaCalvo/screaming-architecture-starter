import type { SignaturePadLabelProps } from '@core/ui/media/signature-pad/types/SignaturePadTypes';

export function SignaturePadLabel({ id, label, required }: Readonly<SignaturePadLabelProps>) {
	return (
		<label htmlFor={id} className="mb-1 block text-sm font-medium">
			{label}
			{required ? <span className="ml-1 text-destructive">*</span> : null}
		</label>
	);
}
