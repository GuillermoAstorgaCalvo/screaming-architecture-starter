import type { SignaturePadWrapperProps } from './SignaturePadTypes';

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
