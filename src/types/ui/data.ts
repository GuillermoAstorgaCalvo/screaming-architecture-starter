import type { DateLike } from '@src-types/datetime';
import type { HTMLAttributes, ReactNode } from 'react';

import type { StandardSize } from './base';

/**
 * Table column definition
 */
export interface TableColumn<T = unknown> {
	/** Unique identifier for the column */
	id: string;
	/** Column header label */
	header: ReactNode;
	/** Function to extract cell value from row data */
	accessor: (row: T) => ReactNode;
	/** Optional column width */
	width?: string;
	/** Whether the column is sortable */
	sortable?: boolean;
	/** Optional custom header renderer */
	headerRenderer?: (column: TableColumn<T>) => ReactNode;
	/** Optional custom cell renderer */
	cellRenderer?: (value: ReactNode, row: T) => ReactNode;
}

/**
 * Table component props
 */
export interface TableProps<T = unknown> extends HTMLAttributes<HTMLTableElement> {
	/** Array of column definitions */
	columns: TableColumn<T>[];
	/** Array of row data */
	data: T[];
	/** Optional unique key extractor for rows */
	getRowId?: (row: T, index: number) => string;
	/** Whether to show striped rows @default false */
	striped?: boolean;
	/** Whether to show hover effect @default true */
	hoverable?: boolean;
	/** Size of the table @default 'md' */
	size?: StandardSize;
	/** Optional empty state message */
	emptyMessage?: ReactNode;
	/** Optional className for table rows */
	rowClassName?: string | ((row: T, index: number) => string);
}

/**
 * Pagination component props
 */
export interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
	/** Current page number (1-indexed) */
	currentPage: number;
	/** Total number of pages */
	totalPages: number;
	/** Function called when page changes */
	onPageChange: (page: number) => void;
	/** Whether to show first/last page buttons @default true */
	showFirstLast?: boolean;
	/** Whether to show previous/next page buttons @default true */
	showPrevNext?: boolean;
	/** Maximum number of page buttons to show @default 5 */
	maxVisiblePages?: number;
	/** Size of the pagination controls @default 'md' */
	size?: StandardSize;
	/** Optional ID for the pagination container */
	paginationId?: string;
}

/**
 * Calendar event
 */
export interface CalendarEvent {
	/** Unique identifier for the event */
	id: string;
	/** Event date */
	date: DateLike;
	/** Event title/label */
	title: string;
	/** Optional event description */
	description?: string;
	/** Optional event color/variant */
	color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
	/** Optional custom className for the event */
	className?: string;
}

/**
 * Calendar component props
 */
export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	/** Currently displayed month (Date object) */
	month?: DateLike;
	/** Default month to display (uncontrolled) */
	defaultMonth?: DateLike;
	/** Selected date (controlled) */
	selectedDate?: DateLike;
	/** Default selected date (uncontrolled) */
	defaultSelectedDate?: DateLike;
	/** Selected date range (controlled) */
	selectedRange?: { start: DateLike; end: DateLike };
	/** Default selected date range (uncontrolled) */
	defaultSelectedRange?: { start: DateLike; end: DateLike };
	/** Minimum selectable date */
	minDate?: DateLike;
	/** Maximum selectable date */
	maxDate?: DateLike;
	/** Events to display on the calendar */
	events?: CalendarEvent[];
	/** Whether to allow date selection @default false */
	selectable?: boolean;
	/** Whether to allow range selection @default false */
	rangeSelectable?: boolean;
	/** Callback when month changes */
	onMonthChange?: (month: Date) => void;
	/** Callback when date is selected (single selection) */
	onDateSelect?: (date: Date | null) => void;
	/** Callback when date range is selected */
	onRangeSelect?: (range: { start: Date | null; end: Date | null }) => void;
	/** Custom renderer for day cells */
	renderDay?: (props: {
		date: Date;
		isCurrentMonth: boolean;
		isToday: boolean;
		isSelected?: boolean;
		isInRange?: boolean;
		isRangeStart?: boolean;
		isRangeEnd?: boolean;
		events?: CalendarEvent[];
		disabled?: boolean;
		onClick?: (date: Date) => void;
	}) => ReactNode;
	/** Custom renderer for event badges */
	renderEvent?: (event: CalendarEvent) => ReactNode;
	/** Whether to show week numbers @default false */
	showWeekNumbers?: boolean;
	/** Locale for date formatting @default 'en-US' */
	locale?: string;
	/** First day of week (0 = Sunday, 1 = Monday, etc.) @default 0 */
	firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // eslint-disable-line no-magic-numbers
	/** Whether to show navigation buttons @default true */
	showNavigation?: boolean;
	/** Custom header content */
	headerContent?: ReactNode;
	/** Whether the calendar is disabled @default false */
	disabled?: boolean;
	/** ID for the calendar element */
	calendarId?: string;
}

/**
 * DescriptionList orientation types
 */
export type DescriptionListOrientation = 'horizontal' | 'vertical';

/**
 * DescriptionList component props
 */
export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
	/** Orientation of the list @default 'horizontal' */
	orientation?: DescriptionListOrientation;
	/** Size of the list @default 'md' */
	size?: StandardSize;
	/** Whether to show dividers between items @default false */
	divided?: boolean;
	/** DescriptionList content (DescriptionTerm and DescriptionDetails components) */
	children: ReactNode;
}

/**
 * DescriptionTerm component props
 */
export interface DescriptionTermProps extends HTMLAttributes<HTMLElement> {
	/** Term content */
	children: ReactNode;
}

/**
 * DescriptionDetails component props
 */
export interface DescriptionDetailsProps extends HTMLAttributes<HTMLElement> {
	/** Details content */
	children: ReactNode;
}

/**
 * InfiniteScroll component props
 */
export interface InfiniteScrollProps extends HTMLAttributes<HTMLDivElement> {
	/** Whether more data is currently being loaded */
	isLoading: boolean;
	/** Whether there is more data to load */
	hasMore: boolean;
	/** Callback function to load more data */
	onLoadMore: () => void | Promise<void>;
	/** Optional custom loading component (replaces default Spinner) */
	loadingComponent?: ReactNode;
	/** Optional custom loading text */
	loadingText?: string;
	/** Optional custom end message when no more data is available */
	endMessage?: ReactNode;
	/** Optional custom error message */
	errorMessage?: ReactNode;
	/** Whether an error occurred */
	hasError?: boolean;
	/** Callback to retry loading after an error */
	onRetry?: () => void;
	/** Threshold in pixels from bottom to trigger load more @default 100 */
	threshold?: number;
	/** Root margin for Intersection Observer (e.g., '100px') @default '100px' */
	rootMargin?: string;
	/** Optional custom empty state component */
	emptyComponent?: ReactNode;
	/** Whether to show empty state (when no items and not loading) */
	showEmpty?: boolean;
	/** Children to render (the scrollable content) */
	children: ReactNode;
}

/**
 * Chart data point
 */
export interface ChartDataPoint {
	/** Label for the data point (x-axis) */
	name: string;
	/** Value for the data point (y-axis) */
	value: number;
	/** Optional additional data fields */
	[key: string]: string | number | undefined;
}

/**
 * Chart color scheme
 */
export type ChartColorScheme =
	| 'default'
	| 'primary'
	| 'secondary'
	| 'success'
	| 'warning'
	| 'error'
	| 'info'
	| string[];

/**
 * Base chart component props
 */
export interface BaseChartProps extends HTMLAttributes<HTMLDivElement> {
	/** Chart data array */
	data: ChartDataPoint[];
	/** Chart title */
	title?: string;
	/** Chart description (for accessibility) */
	description?: string;
	/** Width of the chart @default '100%' */
	width?: number | string;
	/** Height of the chart @default 300 */
	height?: number;
	/** Color scheme for the chart @default 'default' */
	colorScheme?: ChartColorScheme;
	/** Whether to show legend @default true */
	showLegend?: boolean;
	/** Whether to show tooltip @default true */
	showTooltip?: boolean;
	/** Whether to show grid lines @default true */
	showGrid?: boolean;
	/** Size of the chart @default 'md' */
	size?: StandardSize;
	/** Optional empty state message */
	emptyMessage?: ReactNode;
	/** Custom className for the chart container */
	chartClassName?: string;
}

/**
 * BarChart component props
 */
export interface BarChartProps extends BaseChartProps {
	/** Data key for the value (if data has multiple value fields) */
	dataKey?: string;
	/** Orientation of bars @default 'vertical' */
	orientation?: 'horizontal' | 'vertical';
	/** Whether bars are stacked @default false */
	stacked?: boolean;
	/** Gap between bars @default 0 */
	barGap?: number;
	/** Category gap (gap between groups) @default 0 */
	categoryGap?: number;
	/** Radius of bar corners @default 0 */
	radius?: number | [number, number, number, number];
}

/**
 * LineChart component props
 */
export interface LineChartProps extends BaseChartProps {
	/** Data key for the value (if data has multiple value fields) */
	dataKey?: string;
	/** Whether to show dots on data points @default true */
	showDots?: boolean;
	/** Whether to fill area under the line @default false */
	filled?: boolean;
	/** Stroke width of the line @default 2 */
	strokeWidth?: number;
	/** Type of curve @default 'linear' */
	curveType?: 'linear' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';
	/** Whether to connect null values @default false */
	connectNulls?: boolean;
}

/**
 * AreaChart component props
 */
export interface AreaChartProps extends BaseChartProps {
	/** Data key for the value (if data has multiple value fields) */
	dataKey?: string;
	/** Whether to show dots on data points @default false */
	showDots?: boolean;
	/** Stroke width of the area border @default 2 */
	strokeWidth?: number;
	/** Type of curve @default 'monotone' */
	curveType?: 'linear' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';
	/** Whether to connect null values @default false */
	connectNulls?: boolean;
	/** Opacity of the area fill @default 0.6 */
	fillOpacity?: number;
}

/**
 * PieChart component props
 */
export interface PieChartProps extends BaseChartProps {
	/** Data key for the value */
	dataKey: string;
	/** Data key for the label/name */
	nameKey?: string;
	/** Inner radius (for donut chart) @default 0 */
	innerRadius?: number;
	/** Outer radius (percentage of container) @default 80 */
	outerRadius?: number;
	/** Padding angle between segments @default 0 */
	paddingAngle?: number;
	/** Start angle (in degrees) @default 0 */
	startAngle?: number;
	/** End angle (in degrees) @default 360 */
	endAngle?: number;
	/** Whether to show labels on segments @default true */
	showLabels?: boolean;
	/** Whether to show active segment on hover @default true */
	activeOnHover?: boolean;
	/** Label line length @default 30 */
	labelLineLength?: number;
}

/**
 * Transfer option/item
 */
export interface TransferOption<T = unknown> {
	/** Unique identifier for the option */
	value: string;
	/** Display label for the option */
	label: ReactNode;
	/** Optional additional data */
	data?: T;
	/** Whether the option is disabled @default false */
	disabled?: boolean;
}

/**
 * Transfer component props
 */
export interface TransferProps<T = unknown>
	extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	/** Available options (source list) */
	options: readonly TransferOption<T>[];
	/** Selected values (target list) - controlled */
	value?: string[];
	/** Default selected values (uncontrolled) */
	defaultValue?: string[];
	/** Callback when selection changes */
	onChange?: (selectedValues: string[]) => void;
	/** Title for the source list */
	sourceTitle?: ReactNode;
	/** Title for the target list */
	targetTitle?: ReactNode;
	/** Placeholder text for search inputs */
	searchPlaceholder?: string;
	/** Whether to show search inputs @default true */
	showSearch?: boolean;
	/** Custom filter function for search */
	filterFn?: (option: TransferOption<T>, searchValue: string) => boolean;
	/** Size of the component @default 'md' */
	size?: StandardSize;
	/** Whether the component is disabled @default false */
	disabled?: boolean;
	/** Custom renderer for list items */
	renderItem?: (option: TransferOption<T>, isSelected: boolean) => ReactNode;
	/** Custom renderer for empty state */
	renderEmpty?: (listType: 'source' | 'target') => ReactNode;
	/** Maximum height of each list in pixels @default 300 */
	maxHeight?: number;
	/** Whether to show select all/none buttons @default true */
	showSelectAll?: boolean;
	/** Custom labels for buttons */
	labels?: {
		selectAll?: string;
		selectNone?: string;
		moveToRight?: string;
		moveToLeft?: string;
	};
	/** ID for the transfer component */
	transferId?: string;
}
