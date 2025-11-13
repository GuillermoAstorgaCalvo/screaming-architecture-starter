/**
 * MotionList - Purpose-built list wrapper with staggered entrances
 *
 * Composes MotionStagger + MotionBox to provide a convenient API for animating
 * collections with consistent timing and reduced-motion awareness.
 */

import { MotionStagger } from '@core/ui/utilities/motion/components/MotionStagger';
import { MotionBox } from '@core/ui/utilities/motion/MotionBox';
import type {
	MotionBoxProps,
	MotionDuration,
	MotionVariant,
	ReducedMotionStrategy,
} from '@core/ui/utilities/motion/types/motionTypes';
import type { ComponentProps, Key, ReactNode } from 'react';

/**
 * Props for MotionList component
 */
export interface MotionListProps<TItem> {
	/** Collection of items to render */
	items: readonly TItem[];
	/** Render function for each item */
	renderItem: (item: TItem, index: number) => ReactNode;
	/** Custom key resolver, defaults to array index */
	getItemKey?: (item: TItem, index: number) => Key;
	/** Shift-in variant for list items @default 'fade' */
	itemVariant?: MotionVariant;
	/** Duration token for list items @default 'normal' */
	itemDuration?: MotionDuration;
	/** Optional props merged into each MotionBox */
	itemProps?: Partial<Omit<MotionBoxProps, 'children'>>;
	/** Optional wrapper className */
	className?: string;
	/** Stagger delay between children (seconds) @default 0.1 */
	staggerDelay?: number;
	/** Delay before first child animation (seconds) @default 0.1 */
	delayChildren?: number;
	/** Strategy to apply when reduced motion is requested @default 'fade' */
	reducedMotionStrategy?: ReducedMotionStrategy;
	/** Optional fallback to render when list is empty */
	emptyFallback?: ReactNode;
}

type MotionStaggerProps = ComponentProps<typeof MotionStagger>;

interface StaggerConfig {
	className?: MotionStaggerProps['className'];
	staggerDelay?: MotionStaggerProps['staggerDelay'];
	delayChildren?: MotionStaggerProps['delayChildren'];
	reducedMotionStrategy: ReducedMotionStrategy;
}

interface RenderMotionItemsParams<TItem> {
	items: readonly TItem[];
	renderItem: (item: TItem, index: number) => ReactNode;
	getItemKey?: (item: TItem, index: number) => Key;
	itemVariant: MotionVariant;
	itemDuration: MotionDuration;
	itemProps?: Partial<Omit<MotionBoxProps, 'children'>>;
	reducedMotionStrategy: ReducedMotionStrategy;
}

function resolveReducedStrategy(strategy: ReducedMotionStrategy): ReducedMotionStrategy {
	return strategy === 'skip' ? 'static' : strategy;
}

function buildStaggerProps({
	className,
	staggerDelay,
	delayChildren,
	reducedMotionStrategy,
}: StaggerConfig): Pick<
	MotionStaggerProps,
	'className' | 'staggerDelay' | 'delayChildren' | 'reducedMotionStrategy'
> {
	return {
		...(className === undefined ? {} : { className }),
		...(staggerDelay === undefined ? {} : { staggerDelay }),
		...(delayChildren === undefined ? {} : { delayChildren }),
		reducedMotionStrategy: resolveReducedStrategy(reducedMotionStrategy),
	};
}

function renderMotionItems<TItem>({
	items,
	renderItem,
	getItemKey,
	itemVariant,
	itemDuration,
	itemProps,
	reducedMotionStrategy,
}: RenderMotionItemsParams<TItem>) {
	return items.map((item, index) => (
		<MotionBox
			key={getItemKey ? getItemKey(item, index) : index}
			variant={itemVariant}
			duration={itemDuration}
			reducedMotionStrategy={reducedMotionStrategy}
			{...itemProps}
		>
			{renderItem(item, index)}
		</MotionBox>
	));
}

/**
 * MotionList component
 */
export function MotionList<TItem>({
	items,
	renderItem,
	getItemKey,
	itemVariant = 'fade',
	itemDuration = 'normal',
	itemProps,
	className,
	staggerDelay,
	delayChildren,
	reducedMotionStrategy = 'fade',
	emptyFallback = null,
}: Readonly<MotionListProps<TItem>>) {
	if (items.length === 0) {
		return emptyFallback;
	}

	const staggerProps = buildStaggerProps({
		className,
		staggerDelay,
		delayChildren,
		reducedMotionStrategy,
	});

	return (
		<MotionStagger {...staggerProps}>
			{renderMotionItems({
				items,
				renderItem,
				itemVariant,
				itemDuration,
				reducedMotionStrategy,
				...(getItemKey === undefined ? {} : { getItemKey }),
				...(itemProps === undefined ? {} : { itemProps }),
			})}
		</MotionStagger>
	);
}
