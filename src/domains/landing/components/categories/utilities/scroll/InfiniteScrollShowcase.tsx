import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import InfiniteScroll from '@core/ui/utilities/infinite-scroll/InfiniteScroll';
import {
	createInfiniteScrollLoadHandler,
	type InfiniteScrollActions,
	type InfiniteScrollState,
} from '@domains/landing/components/categories/utilities/constants/constants';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

interface InfiniteScrollShowcaseProps {
	readonly state: InfiniteScrollState;
	readonly actions: InfiniteScrollActions;
}

export function InfiniteScrollShowcase({ state, actions }: InfiniteScrollShowcaseProps) {
	return (
		<ShowcaseSection
			title="InfiniteScroll"
			description="Infinite scrolling with loading states"
			tags={['utility', 'scroll', 'infinite', 'loading']}
		>
			<div className="space-y-4">
				<InfiniteScroll
					isLoading={state.loading}
					hasMore={state.hasMore}
					onLoadMore={createInfiniteScrollLoadHandler(state, actions)}
				>
					{state.items.map(item => (
						<Card key={item.id} variant="outlined" padding="sm" className="mb-2">
							<Text size="sm">{item.name}</Text>
						</Card>
					))}
				</InfiniteScroll>
			</div>
		</ShowcaseSection>
	);
}
