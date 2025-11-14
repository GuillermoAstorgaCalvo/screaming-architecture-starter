import type { ReactNode } from 'react';

interface FloatingActionButtonContentProps {
	readonly icon: ReactNode;
	readonly extended: boolean;
	readonly label?: ReactNode;
}

/**
 * Renders the FAB content (icon and optional label)
 *
 * @param props - Content props
 * @returns FAB content JSX
 *
 * @internal
 */
export function FloatingActionButtonContent({
	icon,
	extended,
	label,
}: Readonly<FloatingActionButtonContentProps>) {
	return (
		<span className="flex items-center gap-2">
			{icon}
			{extended && label ? <span className="font-medium">{label}</span> : null}
		</span>
	);
}
