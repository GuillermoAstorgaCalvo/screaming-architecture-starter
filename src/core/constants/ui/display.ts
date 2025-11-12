/**
 * Display component constants
 * Constants for Skeleton, Badge, Heading, Text, Card, Link, Progress, Divider, and Separator components
 */

import type { StandardSize } from '@src-types/ui/base';
import type { DescriptionListOrientation } from '@src-types/ui/data';
import type { BadgeVariant, StatusIndicatorStatus } from '@src-types/ui/feedback';
import type { CardVariant } from '@src-types/ui/layout/card';
import type { DividerOrientation, SeparatorOrientation } from '@src-types/ui/layout/divider';
import type { ListVariant } from '@src-types/ui/layout/list';
import type { TimelineOrientation } from '@src-types/ui/layout/timeline';
import type { LinkVariant, StepperOrientation } from '@src-types/ui/navigation';

/**
 * Skeleton base classes
 */
export const SKELETON_BASE_CLASSES = 'animate-pulse rounded bg-gray-200 dark:bg-gray-700';

/**
 * Badge base classes
 */
export const BADGE_BASE_CLASSES =
	'inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

/**
 * Badge size classes (padding + text size)
 */
export const BADGE_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'px-2 py-0.5 text-xs',
	md: 'px-2.5 py-1 text-sm',
	lg: 'px-3 py-1.5 text-base',
} as const;

/**
 * Badge variant classes
 */
export const BADGE_VARIANT_CLASSES: Record<BadgeVariant, string> = {
	default: 'bg-gray-100 text-gray-800 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200',
	primary:
		'bg-primary text-primary-foreground focus:ring-primary dark:bg-primary dark:text-primary-foreground',
	success: 'bg-green-100 text-green-800 focus:ring-green-500 dark:bg-green-900 dark:text-green-200',
	warning:
		'bg-yellow-100 text-yellow-800 focus:ring-yellow-500 dark:bg-yellow-900 dark:text-yellow-200',
	error: 'bg-red-100 text-red-800 focus:ring-red-500 dark:bg-red-900 dark:text-red-200',
	info: 'bg-blue-100 text-blue-800 focus:ring-blue-500 dark:bg-blue-900 dark:text-blue-200',
} as const;

/**
 * Chip base classes (similar to Badge but with gap for remove button)
 */
export const CHIP_BASE_CLASSES =
	'inline-flex items-center gap-1.5 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

/**
 * Chip size classes (padding + text size, same as Badge)
 */
export const CHIP_SIZE_CLASSES: Record<StandardSize, string> = BADGE_SIZE_CLASSES;

/**
 * Chip variant classes (same as Badge)
 */
export const CHIP_VARIANT_CLASSES: Record<BadgeVariant, string> = BADGE_VARIANT_CLASSES;

/**
 * Heading size classes (text size + font weight)
 */
export const HEADING_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-lg font-semibold',
	md: 'text-xl font-semibold',
	lg: 'text-2xl font-bold',
} as const;

/**
 * Text size classes (text size + line height)
 */
export const TEXT_TYPOGRAPHY_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-sm leading-relaxed',
	md: 'text-base leading-relaxed',
	lg: 'text-lg leading-relaxed',
} as const;

/**
 * Card base classes
 */
export const CARD_BASE_CLASSES = 'rounded-lg border bg-white transition-shadow dark:bg-gray-800';

/**
 * Card variant classes
 */
export const CARD_VARIANT_CLASSES: Record<CardVariant, string> = {
	elevated:
		'border-gray-200 shadow-md hover:shadow-lg dark:border-gray-700 dark:shadow-gray-900/50',
	outlined: 'border-gray-300 dark:border-gray-600',
	flat: 'border-transparent shadow-sm dark:shadow-gray-900/30',
} as const;

/**
 * Card padding classes
 */
export const CARD_PADDING_CLASSES: Record<StandardSize, string> = {
	sm: 'p-3',
	md: 'p-4',
	lg: 'p-6',
} as const;

/**
 * Link base classes
 */
export const LINK_BASE_CLASSES =
	'inline-flex items-center text-primary underline-offset-4 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded';

/**
 * Link variant classes
 */
export const LINK_VARIANT_CLASSES: Record<LinkVariant, string> = {
	default: 'text-primary hover:text-primary/90 dark:text-primary dark:hover:text-primary/80',
	subtle: 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200',
	muted: 'text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300',
} as const;

/**
 * Link size classes (text size)
 */
export const LINK_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg',
} as const;

/**
 * Progress base classes
 */
export const PROGRESS_BASE_CLASSES =
	'w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700';

/**
 * Progress bar base classes
 */
export const PROGRESS_BAR_BASE_CLASSES =
	'h-full transition-all duration-300 ease-in-out bg-primary';

/**
 * Progress size classes (height)
 */
export const PROGRESS_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'h-1',
	md: 'h-2',
	lg: 'h-3',
} as const;

/**
 * Meter base classes
 */
export const METER_BASE_CLASSES =
	'w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 appearance-none [&::-webkit-meter-bar]:appearance-none [&::-webkit-meter-optimum-value]:appearance-none [&::-webkit-meter-suboptimum-value]:appearance-none [&::-webkit-meter-even-less-good-value]:appearance-none';

/**
 * Meter bar base classes
 */
export const METER_BAR_BASE_CLASSES = 'h-full transition-all duration-300 ease-in-out';

/**
 * Meter size classes (height)
 */
export const METER_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'h-1',
	md: 'h-2',
	lg: 'h-3',
} as const;

/**
 * Meter variant classes (color based on thresholds)
 */
export const METER_VARIANT_CLASSES: Record<'default' | 'success' | 'warning' | 'error', string> = {
	default: 'bg-primary',
	success: 'bg-green-500 dark:bg-green-600',
	warning: 'bg-yellow-500 dark:bg-yellow-600',
	error: 'bg-red-500 dark:bg-red-600',
} as const;

/**
 * Divider base classes
 */
export const DIVIDER_BASE_CLASSES = 'border-gray-300 dark:border-gray-600';

/**
 * Divider orientation classes
 */
export const DIVIDER_ORIENTATION_CLASSES: Record<DividerOrientation, string> = {
	horizontal: 'w-full border-t',
	vertical: 'h-full border-l',
} as const;

/**
 * Separator base classes (lighter than Divider)
 */
export const SEPARATOR_BASE_CLASSES = 'border-gray-200 dark:border-gray-500';

/**
 * Separator orientation classes
 */
export const SEPARATOR_ORIENTATION_CLASSES: Record<SeparatorOrientation, string> = {
	horizontal: 'w-full border-t',
	vertical: 'h-full border-l',
} as const;

/**
 * List base classes
 */
export const LIST_BASE_CLASSES = 'list-none p-0 m-0';

/**
 * List variant classes
 */
export const LIST_VARIANT_CLASSES: Record<ListVariant, string> = {
	default: '',
	bordered: 'border border-gray-200 rounded-lg dark:border-gray-700',
	divided: 'divide-y divide-gray-200 dark:divide-gray-700',
} as const;

/**
 * List item size classes (padding)
 */
export const LIST_ITEM_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'px-3 py-2',
	md: 'px-4 py-3',
	lg: 'px-5 py-4',
} as const;

/**
 * Stepper base classes
 */
export const STEPPER_BASE_CLASSES = 'flex';

/**
 * Stepper orientation classes
 */
export const STEPPER_ORIENTATION_CLASSES: Record<StepperOrientation, string> = {
	horizontal: 'flex-row items-center',
	vertical: 'flex-col',
} as const;

/**
 * Stepper step size classes
 */
export const STEPPER_STEP_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg',
} as const;

/**
 * Timeline base classes
 */
export const TIMELINE_BASE_CLASSES = 'flex';

/**
 * Timeline orientation classes
 */
export const TIMELINE_ORIENTATION_CLASSES: Record<TimelineOrientation, string> = {
	vertical: 'flex-col',
	horizontal: 'flex-row',
} as const;

/**
 * Timeline event size classes (text size + spacing)
 */
export const TIMELINE_EVENT_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-sm gap-2',
	md: 'text-base gap-3',
	lg: 'text-lg gap-4',
} as const;

/**
 * Timeline marker size classes (marker dimensions)
 */
export const TIMELINE_MARKER_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'w-2 h-2',
	md: 'w-3 h-3',
	lg: 'w-4 h-4',
} as const;

/**
 * Timeline marker icon size classes (icon container dimensions)
 */
export const TIMELINE_MARKER_ICON_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'w-6 h-6',
	md: 'w-8 h-8',
	lg: 'w-10 h-10',
} as const;

/**
 * Timeline connector size classes (connector width/height)
 */
export const TIMELINE_CONNECTOR_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'w-0.5',
	md: 'w-0.5',
	lg: 'w-1',
} as const;

/**
 * StatCard base classes
 */
export const STAT_CARD_BASE_CLASSES = 'flex flex-col gap-2';

/**
 * StatCard value size classes (text size + font weight)
 */
export const STAT_CARD_VALUE_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-2xl font-bold',
	md: 'text-3xl font-bold',
	lg: 'text-4xl font-bold',
} as const;

/**
 * StatCard label size classes (text size)
 */
export const STAT_CARD_LABEL_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-xs',
	md: 'text-sm',
	lg: 'text-base',
} as const;

/**
 * StatCard trend size classes (text size)
 */
export const STAT_CARD_TREND_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-xs',
	md: 'text-sm',
	lg: 'text-base',
} as const;

/**
 * StatCard icon size classes (icon container dimensions)
 */
export const STAT_CARD_ICON_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'w-8 h-8',
	md: 'w-10 h-10',
	lg: 'w-12 h-12',
} as const;

/**
 * Code base classes (inline code)
 */
export const CODE_BASE_CLASSES =
	'inline-block rounded bg-gray-100 px-1.5 py-0.5 font-mono font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-100';

/**
 * Code size classes (text size)
 */
export const CODE_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-xs',
	md: 'text-sm',
	lg: 'text-base',
} as const;

/**
 * CodeBlock base classes (code block container)
 */
export const CODE_BLOCK_BASE_CLASSES =
	'overflow-x-auto rounded-lg border bg-gray-50 dark:bg-gray-900 dark:border-gray-700';

/**
 * CodeBlock size classes (padding + text size)
 */
export const CODE_BLOCK_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'p-3 text-xs',
	md: 'p-4 text-sm',
	lg: 'p-5 text-base',
} as const;

/**
 * DescriptionList base classes
 */
export const DESCRIPTION_LIST_BASE_CLASSES = '';

/**
 * DescriptionList orientation classes
 */
export const DESCRIPTION_LIST_ORIENTATION_CLASSES: Record<DescriptionListOrientation, string> = {
	horizontal: 'grid grid-cols-1 sm:grid-cols-[max-content_1fr] gap-x-4 gap-y-2',
	vertical: 'flex flex-col gap-y-2',
} as const;

/**
 * DescriptionList size classes (text size + spacing)
 */
export const DESCRIPTION_LIST_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-sm gap-y-1.5 gap-x-3',
	md: 'text-base gap-y-2 gap-x-4',
	lg: 'text-lg gap-y-2.5 gap-x-5',
} as const;

/**
 * DescriptionTerm base classes
 */
export const DESCRIPTION_TERM_BASE_CLASSES = 'font-medium text-gray-900 dark:text-gray-100';

/**
 * DescriptionTerm size classes (text size)
 */
export const DESCRIPTION_TERM_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg',
} as const;

/**
 * DescriptionDetails base classes
 */
export const DESCRIPTION_DETAILS_BASE_CLASSES = 'text-gray-600 dark:text-gray-400';

/**
 * DescriptionDetails size classes (text size)
 */
export const DESCRIPTION_DETAILS_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg',
} as const;

/**
 * StatusIndicator base classes
 */
export const STATUS_INDICATOR_BASE_CLASSES = 'inline-flex items-center gap-1.5 transition-colors';

/**
 * StatusIndicator status classes (dot color)
 */
export const STATUS_INDICATOR_STATUS_CLASSES: Record<StatusIndicatorStatus, string> = {
	online: 'bg-green-500 dark:bg-green-400',
	offline: 'bg-gray-400 dark:bg-gray-500',
	busy: 'bg-red-500 dark:bg-red-400',
	away: 'bg-yellow-500 dark:bg-yellow-400',
} as const;

/**
 * StatusIndicator dot size classes (dot dimensions)
 */
export const STATUS_INDICATOR_DOT_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'w-2 h-2',
	md: 'w-2.5 h-2.5',
	lg: 'w-3 h-3',
} as const;

/**
 * StatusIndicator badge size classes (badge padding + text size)
 */
export const STATUS_INDICATOR_BADGE_SIZE_CLASSES: Record<StandardSize, string> = BADGE_SIZE_CLASSES;

/**
 * StatusIndicator badge base classes
 */
export const STATUS_INDICATOR_BADGE_BASE_CLASSES =
	'rounded-full font-medium inline-flex items-center gap-1.5';

/**
 * StatusIndicator badge status classes (badge background + text color)
 */
export const STATUS_INDICATOR_BADGE_STATUS_CLASSES: Record<StatusIndicatorStatus, string> = {
	online: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
	offline: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
	busy: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
	away: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
} as const;
