import ErrorText from '@core/ui/error-text/ErrorText';
import HelperText from '@core/ui/helper-text/HelperText';
import Label from '@core/ui/label/Label';
import { classNames } from '@core/utils/classNames';
import type { StandardSize } from '@src-types/ui';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputWrapperProps {
	readonly fullWidth: boolean;
	readonly children: ReactNode;
}

export function InputWrapper({ fullWidth, children }: Readonly<InputWrapperProps>) {
	return <div className={fullWidth ? 'w-full' : undefined}>{children}</div>;
}

export interface InputFieldProps {
	readonly id: string | undefined;
	readonly className: string;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly leftIcon?: ReactNode;
	readonly rightIcon?: ReactNode;
	readonly props: Readonly<
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			'size' | 'id' | 'className' | 'disabled' | 'required' | 'aria-invalid' | 'aria-describedby'
		>
	>;
}

export function InputField({
	id,
	className,
	hasError,
	ariaDescribedBy,
	disabled,
	required,
	leftIcon,
	rightIcon,
	props: inputProps,
}: Readonly<InputFieldProps>) {
	return (
		<div className="relative">
			{leftIcon ? <InputIcon position="left">{leftIcon}</InputIcon> : null}
			<input
				id={id}
				className={className}
				disabled={disabled}
				required={required}
				aria-invalid={hasError}
				aria-describedby={ariaDescribedBy}
				{...inputProps}
			/>
			{rightIcon ? <InputIcon position="right">{rightIcon}</InputIcon> : null}
		</div>
	);
}

interface InputMessagesProps {
	readonly inputId: string;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
}

export function InputMessages({ inputId, error, helperText }: Readonly<InputMessagesProps>) {
	if (error) {
		return <ErrorText id={`${inputId}-error`}>{error}</ErrorText>;
	}
	if (helperText) {
		return <HelperText id={`${inputId}-helper`}>{helperText}</HelperText>;
	}
	return null;
}

interface InputLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean | undefined;
}

export function InputLabel({ id, label, required }: Readonly<InputLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}

interface InputIconProps {
	readonly position: 'left' | 'right';
	readonly children: ReactNode;
}

function InputIcon({ position, children }: Readonly<InputIconProps>) {
	const positionClasses =
		position === 'left'
			? 'absolute inset-y-0 left-0 flex items-center pl-3'
			: 'absolute inset-y-0 right-0 flex items-center pr-3';
	return (
		<div
			className={classNames(
				positionClasses,
				'pointer-events-none text-gray-400 dark:text-gray-500'
			)}
		>
			{children}
		</div>
	);
}

export interface UseInputStateOptions {
	readonly inputId?: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly leftIcon?: ReactNode;
	readonly rightIcon?: ReactNode;
	readonly className?: string | undefined;
}

export interface UseInputStateReturn {
	readonly finalId: string | undefined;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly inputClasses: string;
}

export interface InputContentProps {
	readonly state: UseInputStateReturn;
	readonly fieldProps: Readonly<InputFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}

export function InputContent({
	state,
	fieldProps,
	label,
	error,
	helperText,
	required,
	fullWidth,
}: Readonly<InputContentProps>) {
	return (
		<InputWrapper fullWidth={fullWidth}>
			{label && state.finalId ? (
				<InputLabel id={state.finalId} label={label} required={required} />
			) : null}
			<InputField {...fieldProps} />
			{state.finalId ? (
				<InputMessages inputId={state.finalId} error={error} helperText={helperText} />
			) : null}
		</InputWrapper>
	);
}
