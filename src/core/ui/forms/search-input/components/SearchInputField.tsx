import { useDebouncedCallback } from '@core/hooks/debounce/useDebounce';
import { useTranslation } from '@core/i18n/useTranslation';
import type { SearchInputFieldProps } from '@core/ui/forms/search-input/types/SearchInputTypes';
import Icon from '@core/ui/icons/Icon';
import { classNames } from '@core/utils/classNames';
import type { ChangeEvent, InputHTMLAttributes, MouseEvent } from 'react';

function SearchIcon() {
	return (
		<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-md text-text-muted">
			<Icon name="search" size="sm" />
		</div>
	);
}

interface ClearButtonProps {
	readonly disabled?: boolean;
	readonly onClear: () => void;
}

function ClearButton({ disabled, onClear }: ClearButtonProps) {
	const { t } = useTranslation('common');
	const handleClear = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		onClear();
	};

	return (
		<div className="absolute inset-y-0 right-0 flex items-center pr-md">
			<button
				type="button"
				onClick={handleClear}
				disabled={disabled}
				aria-label={t('a11y.clearSearch')}
				className={classNames(
					'flex items-center justify-center',
					'text-text-muted hover:text-text-primary',
					'disabled:cursor-not-allowed disabled:opacity-disabled',
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
	readonly defaultValue?: string;
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
			| 'defaultValue'
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
	defaultValue,
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
			defaultValue={defaultValue}
			aria-invalid={hasError}
			aria-describedby={ariaDescribedBy}
			{...inputProps}
		/>
	);
}

const DEFAULT_DEBOUNCE_DELAY_MS = 300;

export function SearchInputField({
	id,
	className,
	hasError,
	ariaDescribedBy,
	disabled,
	required,
	value,
	defaultValue,
	onClear,
	showClearButton,
	props: inputProps,
}: Readonly<SearchInputFieldProps>) {
	const { onChange, ...restInputProps } = inputProps;
	const debouncedOnChange = useDebouncedCallback((...args: unknown[]) => {
		onChange?.(args[0] as ChangeEvent<HTMLInputElement>);
	}, DEFAULT_DEBOUNCE_DELAY_MS) as (e: ChangeEvent<HTMLInputElement>) => void;

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
				{...(defaultValue !== undefined && { defaultValue })}
				inputProps={{ ...restInputProps, onChange: debouncedOnChange }}
			/>
			{showClearButton && value ? (
				<ClearButton {...(disabled !== undefined && { disabled })} onClear={onClear} />
			) : null}
		</div>
	);
}
