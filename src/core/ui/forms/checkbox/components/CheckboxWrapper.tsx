import type {
	CheckboxContainerProps,
	CheckboxWrapperProps,
} from '@core/ui/forms/checkbox/types/CheckboxTypes';
import { classNames } from '@core/utils/classNames';

export function CheckboxWrapper(props: Readonly<CheckboxWrapperProps>) {
	const { fullWidth, children, ...restProps } = props;

	// Create a new object explicitly excluding fullWidth to prevent React warnings
	// React's development mode checks props objects, so we need to ensure fullWidth
	// is not present in the object we spread to the DOM element
	const { fullWidth: _excluded, ...domProps } = {
		...restProps,
	} as typeof restProps & { fullWidth?: never };

	return (
		<div className={fullWidth ? 'w-full' : undefined} {...domProps}>
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
