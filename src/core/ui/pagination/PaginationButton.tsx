import type { StandardSize } from '@src-types/ui/base';
import type { ReactNode } from 'react';

import { getButtonClasses } from './PaginationHelpers';

// ============================================================================
// Base Button Component
// ============================================================================

export interface PaginationButtonProps {
	ariaLabel: string;
	onClick: () => void;
	disabled?: boolean;
	isActive?: boolean;
	size: StandardSize;
	children: ReactNode;
}

export function PaginationButton({
	ariaLabel,
	onClick,
	disabled,
	isActive,
	size,
	children,
}: Readonly<PaginationButtonProps>) {
	return (
		<button
			aria-label={ariaLabel}
			onClick={onClick}
			disabled={disabled}
			aria-current={isActive ? 'page' : undefined}
			className={getButtonClasses(size, isActive ?? false)}
		>
			{children}
		</button>
	);
}
