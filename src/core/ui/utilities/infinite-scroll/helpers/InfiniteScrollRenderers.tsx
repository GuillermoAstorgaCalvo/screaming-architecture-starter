import { renderInfiniteScrollContainer } from '@core/ui/utilities/infinite-scroll/components/InfiniteScrollContainerRenderer';
import { renderEmptyState } from '@core/ui/utilities/infinite-scroll/components/InfiniteScrollStateRenderers';
import {
	buildContainerRenderProps,
	buildEmptyStateProps,
} from '@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollBuilders';
import type { InfiniteScrollProps } from '@core/ui/utilities/infinite-scroll/types/InfiniteScrollRenderers.types';
import type { ReactNode } from 'react';

/**
 * Determines if the empty state should be shown
 */
function shouldShowEmptyState(showEmpty: boolean, children: ReactNode): boolean {
	return showEmpty && !children;
}

/**
 * Renders infinite scroll based on state
 */
export function renderInfiniteScroll(params: InfiniteScrollProps) {
	if (shouldShowEmptyState(params.showEmpty, params.children)) {
		const emptyStateProps = buildEmptyStateProps(params);
		return renderEmptyState(emptyStateProps);
	}

	const containerProps = buildContainerRenderProps(params);
	return renderInfiniteScrollContainer(containerProps);
}
