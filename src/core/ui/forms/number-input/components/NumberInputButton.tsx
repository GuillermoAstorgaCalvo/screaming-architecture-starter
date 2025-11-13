import type { NumberInputButtonProps } from '@core/ui/forms/number-input/types/NumberInputTypes';
import { classNames } from '@core/utils/classNames';
import type { MouseEvent } from 'react';

export function NumberInputButton({
	onClick,
	disabled,
	'aria-label': ariaLabel,
	children,
}: Readonly<NumberInputButtonProps>) {
	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!disabled) {
			onClick();
		}
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			disabled={disabled}
			aria-label={ariaLabel}
			className={classNames(
				'flex items-center justify-center',
				'text-text-muted hover:text-text-primary',
				'disabled:cursor-not-allowed disabled:opacity-50',
				'transition-colors'
			)}
		>
			{children}
		</button>
	);
}
