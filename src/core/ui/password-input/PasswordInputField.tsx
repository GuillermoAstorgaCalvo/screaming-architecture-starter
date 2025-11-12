import { classNames } from '@core/utils/classNames';
import { Eye, EyeOff } from 'lucide-react';
import type { InputHTMLAttributes, MouseEvent } from 'react';

import type { PasswordInputFieldProps } from './PasswordInputTypes';

type PasswordInputProps = Readonly<{
	id: string | undefined;
	className: string;
	hasError: boolean;
	ariaDescribedBy: string | undefined;
	disabled?: boolean;
	required?: boolean;
	showPassword: boolean;
	inputProps: Readonly<
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			| 'size'
			| 'id'
			| 'className'
			| 'disabled'
			| 'required'
			| 'aria-invalid'
			| 'aria-describedby'
			| 'type'
		>
	>;
}>;

function VisibilityToggleButton({
	showPassword,
	onToggle,
	disabled,
}: Readonly<{
	showPassword: boolean;
	onToggle: () => void;
	disabled?: boolean;
}>) {
	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		onToggle();
	};

	const Icon = showPassword ? EyeOff : Eye;

	return (
		<div className="absolute inset-y-0 right-0 flex items-center pr-3">
			<button
				type="button"
				onClick={handleClick}
				disabled={disabled}
				aria-label={showPassword ? 'Hide password' : 'Show password'}
				className={classNames(
					'flex items-center justify-center',
					'text-text-muted hover:text-text-primary',
					'disabled:cursor-not-allowed disabled:opacity-50',
					'transition-colors',
					'rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20'
				)}
			>
				<Icon className="h-4 w-4" />
			</button>
		</div>
	);
}

function PasswordInput({
	id,
	className,
	hasError,
	ariaDescribedBy,
	disabled,
	required,
	showPassword,
	inputProps,
}: PasswordInputProps) {
	return (
		<input
			id={id}
			type={showPassword ? 'text' : 'password'}
			className={className}
			disabled={disabled}
			required={required}
			aria-invalid={hasError}
			aria-describedby={ariaDescribedBy}
			{...inputProps}
		/>
	);
}

export function PasswordInputField({
	id,
	className,
	hasError,
	ariaDescribedBy,
	disabled,
	required,
	showPassword,
	onToggleVisibility,
	props: inputProps,
}: Readonly<PasswordInputFieldProps>) {
	return (
		<div className="relative">
			<PasswordInput
				id={id}
				className={className}
				hasError={hasError}
				ariaDescribedBy={ariaDescribedBy}
				{...(disabled !== undefined && { disabled })}
				{...(required !== undefined && { required })}
				showPassword={showPassword}
				inputProps={inputProps}
			/>
			<VisibilityToggleButton
				showPassword={showPassword}
				onToggle={onToggleVisibility}
				{...(disabled !== undefined && { disabled })}
			/>
		</div>
	);
}
