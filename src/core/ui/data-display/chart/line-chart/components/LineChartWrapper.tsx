import { ChartContainer, ChartHeader } from '@core/ui/data-display/chart/shared/ChartComponents';
import type { ComponentProps, ReactNode } from 'react';

export interface LineChartWrapperProps {
	readonly title?: string | undefined;
	readonly description?: string | undefined;
	readonly chartClassName?: string | undefined;
	readonly className?: string | undefined;
	readonly testId?: string | undefined;
	readonly children: ReactNode;
	readonly props: Readonly<ComponentProps<'div'>>;
}

export function LineChartWrapper({
	title,
	description,
	chartClassName,
	className,
	testId,
	children,
	props,
}: Readonly<LineChartWrapperProps>) {
	return (
		<div className={className} data-testid="line-chart-root" {...props}>
			<ChartHeader title={title} description={description} />
			<ChartContainer
				chartClassName={chartClassName}
				description={description}
				title={title}
				chartType="Line"
				testId={testId}
			>
				{children}
			</ChartContainer>
		</div>
	);
}
