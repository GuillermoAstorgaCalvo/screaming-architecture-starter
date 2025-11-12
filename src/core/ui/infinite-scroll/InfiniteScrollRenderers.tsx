import type { ReactNode } from 'react';

import { buildContainerRenderProps, buildEmptyStateProps } from './InfiniteScrollBuilders';
import { renderInfiniteScrollContainer } from './InfiniteScrollContainerRenderer';
import type { InfiniteScrollProps } from './InfiniteScrollRenderers.types';
import { renderEmptyState } from './InfiniteScrollStateRenderers';

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
