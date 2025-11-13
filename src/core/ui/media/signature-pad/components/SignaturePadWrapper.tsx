import type { SignaturePadWrapperProps } from '@core/ui/media/signature-pad/types/SignaturePadTypes';

export function SignaturePadWrapper({
	fullWidth,
	children,
	...props
}: Readonly<SignaturePadWrapperProps>) {
	return (
		<div className={fullWidth ? 'w-full' : undefined} {...props}>
			{children}
		</div>
	);
}
