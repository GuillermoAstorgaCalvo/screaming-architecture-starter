import type { EmptyStateIconProps } from '@core/ui/feedback/empty-state/types/emptyState.types';
import { classNames } from '@core/utils/classNames';

export function EmptyStateIcon({ icon, size }: Readonly<EmptyStateIconProps>) {
	if (icon == null) return null;
	return (
		<div className={classNames(size === 'lg' ? 'mb-4' : 'mb-2', 'text-muted-foreground')}>
			{icon}
		</div>
	);
}
