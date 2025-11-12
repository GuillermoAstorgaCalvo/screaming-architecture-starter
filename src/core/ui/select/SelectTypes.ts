import type { StandardSize } from '@src-types/ui/base';
import type { ReactNode, SelectHTMLAttributes } from 'react';

// ============================================================================
// State Types
// ============================================================================

export interface UseSelectStateOptions {
	readonly selectId?: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly className?: string | undefined;
}

export interface UseSelectStateReturn {
	readonly finalId: string | undefined;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly selectClasses: string;
}

// ============================================================================
// Field Props
// ============================================================================

export interface SelectFieldProps {
	readonly id: string | undefined;
	readonly className: string;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly children: ReactNode;
	readonly props: Readonly<
		Omit<
			SelectHTMLAttributes<HTMLSelectElement>,
			| 'size'
			| 'id'
			| 'className'
			| 'disabled'
			| 'required'
			| 'aria-invalid'
			| 'aria-describedby'
			| 'children'
		>
	>;
}
