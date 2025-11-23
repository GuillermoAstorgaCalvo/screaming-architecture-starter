import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import PullToRefresh from '@core/ui/utilities/pull-to-refresh/PullToRefresh';
import { REFRESH_DELAY } from '@domains/landing/components/categories/utilities/constants/constants';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

interface PullToRefreshShowcaseProps {
	readonly refreshing: boolean;
	readonly setRefreshing: (refreshing: boolean) => void;
}

export function PullToRefreshShowcase({ refreshing, setRefreshing }: PullToRefreshShowcaseProps) {
	return (
		<ShowcaseSection
			title="PullToRefresh"
			description="Pull-to-refresh for mobile"
			tags={['utility', 'pull', 'refresh', 'mobile', 'gesture']}
		>
			<div className="space-y-4">
				<PullToRefresh
					onRefresh={() => {
						setRefreshing(true);
						setTimeout(() => {
							setRefreshing(false);
						}, REFRESH_DELAY);
					}}
					disabled={refreshing}
				>
					<Card variant="outlined" padding="md" className="min-h-32">
						<Text>Pull down to refresh (mobile/touch devices)</Text>
						{refreshing ? (
							<Text size="sm" className="mt-2">
								Refreshing...
							</Text>
						) : null}
					</Card>
				</PullToRefresh>
			</div>
		</ShowcaseSection>
	);
}
