import type { ReactNode } from 'react';

export interface RatingContainerProps {
	containerProps: Record<string, unknown>;
	restProps: Record<string, unknown>;
	children: ReactNode;
}

export function RatingContainer({
	containerProps,
	restProps,
	children,
}: Readonly<RatingContainerProps>) {
	return (
		<div {...containerProps} {...restProps}>
			{children}
		</div>
	);
}
