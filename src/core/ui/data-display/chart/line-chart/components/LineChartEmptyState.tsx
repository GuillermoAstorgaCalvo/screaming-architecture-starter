import { ChartEmptyState } from '@core/ui/data-display/chart/shared/ChartComponents';
import type { ComponentProps, ReactNode } from 'react';

export interface LineChartEmptyStateProps {
	readonly title?: string | undefined;
	readonly emptyMessage: string | ReactNode;
	readonly className?: string | undefined;
	readonly props: Readonly<ComponentProps<'div'>>;
}

export function LineChartEmptyState({
	title,
	emptyMessage,
	className,
	props,
}: Readonly<LineChartEmptyStateProps>) {
	return (
		<div className={className} {...props}>
			<ChartEmptyState title={title} emptyMessage={emptyMessage} />
		</div>
	);
}
