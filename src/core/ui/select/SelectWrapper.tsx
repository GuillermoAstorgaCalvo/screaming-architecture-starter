import type { HTMLAttributes, ReactNode } from 'react';

// ============================================================================
// Wrapper Component
// ============================================================================

interface SelectWrapperProps extends HTMLAttributes<HTMLDivElement> {
	readonly fullWidth: boolean;
	readonly children: ReactNode;
}

export function SelectWrapper({ fullWidth, children, ...props }: Readonly<SelectWrapperProps>) {
	return (
		<div className={fullWidth ? 'w-full' : undefined} {...props}>
			{children}
		</div>
	);
}
