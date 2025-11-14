import type { InputIconProps } from '@core/ui/forms/input/types/InputTypes';
import { classNames } from '@core/utils/classNames';

export function InputIcon({ position, children }: Readonly<InputIconProps>) {
	const positionClasses =
		position === 'left'
			? 'absolute inset-y-0 left-0 flex items-center pl-3'
			: 'absolute inset-y-0 right-0 flex items-center pr-3';
	return (
		<div
			className={classNames(
				positionClasses,
				'pointer-events-none text-text-muted dark:text-text-muted'
			)}
		>
			{children}
		</div>
	);
}
