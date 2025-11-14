import { getStatCardIconSizeClasses } from '@core/ui/variants/stat';
import type { StandardSize } from '@src-types/ui/base';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface StatIconProps {
	icon: ReactNode;
	size: StandardSize;
}

/**
 * StatIcon - Displays an icon in a styled container for stat cards
 *
 * Renders the provided icon within a rounded container with primary color
 * background and appropriate sizing based on the stat card size.
 */
export function StatIcon({ icon, size }: Readonly<StatIconProps>) {
	const iconSizeClasses = getStatCardIconSizeClasses(size);

	return (
		<div
			className={twMerge(
				iconSizeClasses,
				'flex shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20'
			)}
			aria-hidden="true"
		>
			{icon}
		</div>
	);
}
