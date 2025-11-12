import { classNames } from '@core/utils/classNames';

import type { CheckboxContainerProps, CheckboxWrapperProps } from './CheckboxTypes';

export function CheckboxWrapper({ fullWidth, children, ...props }: Readonly<CheckboxWrapperProps>) {
	return (
		<div className={fullWidth ? 'w-full' : undefined} {...props}>
			{children}
		</div>
	);
}

export function CheckboxContainer({
	children,
	className,
	...props
}: Readonly<CheckboxContainerProps>) {
	return (
		<div className={classNames('flex items-start gap-2', className)} {...props}>
			{children}
		</div>
	);
}
