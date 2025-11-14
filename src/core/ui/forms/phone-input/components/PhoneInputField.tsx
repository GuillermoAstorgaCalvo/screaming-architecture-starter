import { useTranslation } from '@core/i18n/useTranslation';
import {
	COUNTRY_CODES,
	getCountryCodeByDialCode,
} from '@core/ui/forms/phone-input/helpers/PhoneInputHelpers';
import type { PhoneInputFieldProps } from '@core/ui/forms/phone-input/types/PhoneInputTypes';
import { classNames } from '@core/utils/classNames';
import type { ChangeEvent, InputHTMLAttributes } from 'react';

type SelectorSize = 'sm' | 'md' | 'lg';

interface CountryCodeSelectorProps {
	readonly countryCode: string;
	readonly onChange: (code: string) => void;
	readonly disabled?: boolean;
	readonly size?: SelectorSize;
}

function CountryCodeSelector({
	countryCode,
	onChange,
	disabled,
	size = 'md',
}: Readonly<CountryCodeSelectorProps>) {
	const { t } = useTranslation('common');
	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		onChange(e.target.value);
	};

	const sizeClasses = {
		sm: 'h-8 text-xs',
		md: 'h-10 text-sm',
		lg: 'h-12 text-base',
	};

	return (
		<div className="absolute inset-y-0 left-0 flex items-center pl-md">
			<select
				value={countryCode}
				onChange={handleChange}
				disabled={disabled}
				aria-label={t('a11y.countryCode')}
				className={classNames(
					'border-0 bg-transparent pr-sm',
					'text-text-muted',
					'focus:outline-none',
					'disabled:cursor-not-allowed disabled:opacity-disabled',
					sizeClasses[size]
				)}
			>
				{COUNTRY_CODES.map(country => (
					<option key={country.code} value={country.dialCode}>
						{country.dialCode}
					</option>
				))}
			</select>
		</div>
	);
}

interface PhoneInputProps {
	readonly id: string | undefined;
	readonly className: string;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean;
	readonly required?: boolean;
	readonly countryCode: string;
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
		>
	>;
}

function PhoneInput({
	id,
	className,
	hasError,
	ariaDescribedBy,
	disabled,
	required,
	countryCode,
	inputProps,
}: Readonly<PhoneInputProps>) {
	const country = getCountryCodeByDialCode(countryCode);
	// Uses design tokens for spacing: 4xl = 64px
	// For precise positioning based on dial code length, we use calculated values based on tokens
	// 2-digit codes: 4xl (64px), longer codes: 4xl + lg = 64px + 16px = 80px
	let leftPadding = 'pl-4xl'; // Uses spacing-4xl token (64px) for 3-digit codes
	if (country) {
		leftPadding =
			country.dialCode.length === 2
				? 'pl-4xl' // Uses spacing-4xl token (64px)
				: 'pl-[calc(var(--spacing-4xl)+var(--spacing-lg))]'; // 4xl + lg = 64px + 16px = 80px
	}

	return (
		<input
			id={id}
			type="tel"
			className={classNames(className, leftPadding)}
			disabled={disabled}
			required={required}
			aria-invalid={hasError}
			aria-describedby={ariaDescribedBy}
			{...inputProps}
		/>
	);
}

export function PhoneInputField({
	id,
	className,
	hasError,
	ariaDescribedBy,
	disabled,
	required,
	countryCode,
	onCountryCodeChange,
	props: inputProps,
}: Readonly<PhoneInputFieldProps>) {
	// Extract size from className or default to 'md'
	let size: 'sm' | 'md' | 'lg' = 'md';
	if (className.includes('h-8')) {
		size = 'sm';
	} else if (className.includes('h-12')) {
		size = 'lg';
	}

	return (
		<div className="relative">
			<CountryCodeSelector
				countryCode={countryCode}
				onChange={onCountryCodeChange}
				{...(disabled !== undefined && { disabled })}
				size={size}
			/>
			<PhoneInput
				id={id}
				className={className}
				hasError={hasError}
				ariaDescribedBy={ariaDescribedBy}
				{...(disabled !== undefined && { disabled })}
				{...(required !== undefined && { required })}
				countryCode={countryCode}
				inputProps={inputProps}
			/>
		</div>
	);
}
