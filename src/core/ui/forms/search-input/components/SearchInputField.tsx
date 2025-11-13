import Icon from '@core/ui/icons/Icon';
import { classNames } from '@core/utils/classNames';
import type { InputHTMLAttributes, MouseEvent } from 'react';

import type { SearchInputFieldProps } from './SearchInputTypes';

function SearchIcon() {
	return (
		<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
			<Icon name="search" size="sm" />
		</div>
	);
}

interface ClearButtonProps {
	readonly disabled?: boolean;
	readonly onClear: () => void;
}

function ClearButton({ disabled, onClear }: ClearButtonProps) {
	const handleClear = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		onClear();
	};

	return (
		<div className="absolute inset-y-0 right-0 flex items-center pr-3">
			<button
				type="button"
				onClick={handleClear}
				disabled={disabled}
				aria-label="Clear search"
				className={classNames(
					'flex items-center justify-center',
					'text-text-muted hover:text-text-primary',
					'disabled:cursor-not-allowed disabled:opacity-50',
					'transition-colors',
					'rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20'
				)}
			>
				<Icon name="clear" size="sm" />
			</button>
		</div>
	);
}

interface SearchInputProps {
	readonly id: string | undefined;
	readonly className: string;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean;
	readonly required?: boolean;
	readonly value?: string;
	readonly inputProps: Readonly<
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
			| 'value'
		>
	>;
}

function SearchInput({
	id,
	className,
	hasError,
	ariaDescribedBy,
	disabled,
	required,
	value,
	inputProps,
}: SearchInputProps) {
	return (
		<input
			id={id}
			type="search"
			className={className}
			disabled={disabled}
			required={required}
			value={value}
			aria-invalid={hasError}
			aria-describedby={ariaDescribedBy}
			{...inputProps}
		/>
	);
}

export function SearchInputField({
	id,
	className,
	hasError,
	ariaDescribedBy,
	disabled,
	required,
	value,
	onClear,
	showClearButton,
	props: inputProps,
}: Readonly<SearchInputFieldProps>) {
	return (
		<div className="relative">
			<SearchIcon />
			<SearchInput
				id={id}
				className={className}
				hasError={hasError}
				ariaDescribedBy={ariaDescribedBy}
				{...(disabled !== undefined && { disabled })}
				{...(required !== undefined && { required })}
				{...(value !== undefined && { value })}
				inputProps={inputProps}
			/>
			{showClearButton ? (
				<ClearButton {...(disabled !== undefined && { disabled })} onClear={onClear} />
			) : null}
		</div>
	);
}
