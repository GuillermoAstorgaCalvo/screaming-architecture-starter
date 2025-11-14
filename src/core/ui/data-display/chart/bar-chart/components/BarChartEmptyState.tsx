import { ChartEmptyState } from '@core/ui/data-display/chart/shared/ChartComponents';
import type { ComponentProps, ReactNode } from 'react';

export interface BarChartEmptyStateProps {
	title?: string | undefined;
	emptyMessage: string | ReactNode;
	className?: string | undefined;
	props: Readonly<ComponentProps<'div'>>;
}

export function BarChartEmptyState({
	title,
	emptyMessage,
	className,
	props,
}: Readonly<BarChartEmptyStateProps>) {
	return (
		<div className={className} {...props}>
			<ChartEmptyState title={title} emptyMessage={emptyMessage} />
		</div>
	);
}
