import { ChartEmptyState } from '@core/ui/data-display/chart/shared/ChartComponents';
import type { ReactElement, ReactNode } from 'react';

/**
 * Renders the empty state when no data is available
 */
export function renderEmptyState({
	className,
	title,
	emptyMessage,
	...props
}: {
	className?: string | undefined;
	title?: string | undefined;
	emptyMessage?: ReactNode | undefined;
}): ReactElement {
	return (
		<div className={className} {...props}>
			<ChartEmptyState title={title} emptyMessage={emptyMessage} />
		</div>
	);
}
