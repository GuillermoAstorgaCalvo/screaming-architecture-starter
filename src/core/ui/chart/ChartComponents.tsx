import type { ReactNode } from 'react';
import { CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';

interface ChartHeaderProps {
	title?: string | undefined;
	description?: string | undefined;
}

export function ChartHeader({ title, description }: Readonly<ChartHeaderProps>) {
	return (
		<>
			{title ? (
				<h3 className="mb-4 text-lg font-semibold text-text-primary dark:text-text-primary">
					{title}
				</h3>
			) : null}
			{description ? (
				<p className="mb-2 text-sm text-text-muted dark:text-text-muted" aria-hidden="true">
					{description}
				</p>
			) : null}
		</>
	);
}

interface ChartEmptyStateProps {
	title?: string | undefined;
	emptyMessage: ReactNode;
}

export function ChartEmptyState({ title, emptyMessage }: Readonly<ChartEmptyStateProps>) {
	return (
		<>
			{title ? <h3 className="mb-4 text-lg font-semibold">{title}</h3> : null}
			<div className="flex h-[300px] items-center justify-center text-text-muted">
				{emptyMessage}
			</div>
		</>
	);
}

interface ChartContainerProps {
	chartClassName?: string | undefined;
	description?: string | undefined;
	title?: string | undefined;
	chartType: string;
	children: ReactNode;
}

export function ChartContainer({
	chartClassName,
	description,
	title,
	chartType,
	children,
}: Readonly<ChartContainerProps>) {
	return (
		<div
			className={chartClassName}
			aria-label={description ?? title ?? `${chartType} chart`}
			aria-describedby={description ? undefined : title}
		>
			{children}
		</div>
	);
}

interface ChartAxesProps {
	showGrid: boolean;
	isHorizontal: boolean;
	_dataKey?: string;
}

export function ChartAxes({ showGrid, isHorizontal }: Readonly<ChartAxesProps>) {
	return (
		<>
			{showGrid ? (
				<CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
			) : null}
			{isHorizontal ? (
				<>
					<XAxis type="number" className="text-xs text-text-muted dark:text-text-muted" />
					<YAxis
						dataKey="name"
						type="category"
						width={80}
						className="text-xs text-text-muted dark:text-text-muted"
					/>
				</>
			) : (
				<>
					<XAxis dataKey="name" className="text-xs text-text-muted dark:text-text-muted" />
					<YAxis className="text-xs text-text-muted dark:text-text-muted" />
				</>
			)}
		</>
	);
}

interface ChartTooltipAndLegendProps {
	showTooltip: boolean;
	showLegend: boolean;
}

export function ChartTooltipAndLegend({
	showTooltip,
	showLegend,
}: Readonly<ChartTooltipAndLegendProps>) {
	return (
		<>
			{showTooltip ? (
				<Tooltip
					contentStyle={{
						backgroundColor: 'var(--color-background)',
						border: '1px solid var(--color-border)',
						borderRadius: '0.5rem',
					}}
					labelStyle={{ color: 'var(--color-text-primary)' }}
				/>
			) : null}
			{showLegend ? (
				<Legend
					wrapperStyle={{ paddingTop: '1rem' }}
					className="text-sm text-text-primary dark:text-text-primary"
				/>
			) : null}
		</>
	);
}
