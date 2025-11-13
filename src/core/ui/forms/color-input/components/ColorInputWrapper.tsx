import type { ColorInputWrapperProps } from './ColorInputTypes';

export function ColorInputWrapper({
	fullWidth,
	children,
	...props
}: Readonly<ColorInputWrapperProps>) {
	return (
		<div className={fullWidth ? 'w-full' : undefined} {...props}>
			{children}
		</div>
	);
}
