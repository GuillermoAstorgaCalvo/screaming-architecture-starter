import { ChartContainer, ChartHeader } from '@core/ui/data-display/chart/shared/ChartComponents';
import type { ComponentProps, ReactNode } from 'react';

export interface BarChartWrapperProps {
	title?: string | undefined;
	description?: string | undefined;
	chartClassName?: string | undefined;
	className?: string | undefined;
	children: ReactNode;
	props: Readonly<ComponentProps<'div'>>;
}

export function BarChartWrapper({
	title,
	description,
	chartClassName,
	className,
	children,
	props,
}: Readonly<BarChartWrapperProps>) {
	return (
		<div className={className} data-testid="bar-chart-root" {...props}>
			<ChartHeader title={title} description={description} />
			<ChartContainer
				chartClassName={chartClassName}
				description={description}
				title={title}
				chartType="Bar"
				testId="bar-chart-container"
			>
				{children}
			</ChartContainer>
		</div>
	);
}
