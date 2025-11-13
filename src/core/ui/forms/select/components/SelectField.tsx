import type { SelectFieldProps } from '@core/ui/forms/select/types/SelectTypes';
import { classNames } from '@core/utils/classNames';

// ============================================================================
// Arrow Icon Component
// ============================================================================

function SelectArrowIcon() {
	return (
		<div
			className={classNames(
				'pointer-events-none',
				'absolute inset-y-0 right-0 flex items-center pr-3',
				'text-gray-400 dark:text-gray-500'
			)}
		>
			<svg
				className="h-5 w-5"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					fillRule="evenodd"
					d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
					clipRule="evenodd"
				/>
			</svg>
		</div>
	);
}

// ============================================================================
// Field Component
// ============================================================================

export function SelectField({
	id,
	className,
	hasError,
	ariaDescribedBy,
	disabled,
	required,
	children,
	props: selectProps,
}: Readonly<SelectFieldProps>) {
	return (
		<div className="relative">
			<select
				id={id}
				className={className}
				disabled={disabled}
				required={required}
				aria-invalid={hasError}
				aria-describedby={ariaDescribedBy}
				{...selectProps}
			>
				{children}
			</select>
			<SelectArrowIcon />
		</div>
	);
}
