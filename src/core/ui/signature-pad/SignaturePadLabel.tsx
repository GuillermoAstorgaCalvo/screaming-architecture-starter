import type { SignaturePadLabelProps } from './SignaturePadTypes';

export function SignaturePadLabel({ id, label, required }: Readonly<SignaturePadLabelProps>) {
	return (
		<label htmlFor={id} className="mb-1 block text-sm font-medium">
			{label}
			{required ? <span className="ml-1 text-red-500">*</span> : null}
		</label>
	);
}
