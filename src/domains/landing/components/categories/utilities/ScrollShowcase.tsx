import type {
	InfiniteScrollActions,
	InfiniteScrollState,
} from '@domains/landing/components/categories/utilities/constants/constants';

import { InfiniteScrollShowcase } from './scroll/InfiniteScrollShowcase';
import { PullToRefreshShowcase } from './scroll/PullToRefreshShowcase';
import { ScrollAreaShowcase } from './scroll/ScrollAreaShowcase';
import { ScrollToTopShowcase } from './scroll/ScrollToTopShowcase';
import { VirtualizedListShowcase } from './scroll/VirtualizedListShowcase';

interface ScrollShowcaseProps {
	readonly infiniteItems: Array<{ id: number; name: string }>;
	readonly infiniteLoading: boolean;
	readonly hasMore: boolean;
	readonly setInfiniteItems: (items: Array<{ id: number; name: string }>) => void;
	readonly setInfiniteLoading: (loading: boolean) => void;
	readonly setHasMore: (hasMore: boolean) => void;
	readonly refreshing: boolean;
	readonly setRefreshing: (refreshing: boolean) => void;
}

export function ScrollShowcase({
	infiniteItems,
	infiniteLoading,
	hasMore,
	setInfiniteItems,
	setInfiniteLoading,
	setHasMore,
	refreshing,
	setRefreshing,
}: ScrollShowcaseProps) {
	const infiniteScrollState: InfiniteScrollState = {
		items: infiniteItems,
		loading: infiniteLoading,
		hasMore,
	};

	const infiniteScrollActions: InfiniteScrollActions = {
		setItems: setInfiniteItems,
		setLoading: setInfiniteLoading,
		setHasMore,
	};

	return (
		<div className="space-y-8">
			<ScrollAreaShowcase />
			<ScrollToTopShowcase />
			<InfiniteScrollShowcase state={infiniteScrollState} actions={infiniteScrollActions} />
			<VirtualizedListShowcase />
			<PullToRefreshShowcase refreshing={refreshing} setRefreshing={setRefreshing} />
		</div>
	);
}
