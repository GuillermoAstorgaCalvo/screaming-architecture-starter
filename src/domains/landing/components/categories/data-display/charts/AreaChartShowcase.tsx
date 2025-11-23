import AreaChart from '@core/ui/data-display/chart/area-chart/AreaChart';
import { CHART_DATA } from '@domains/landing/components/categories/data-display/constants/constants';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function AreaChartShowcase() {
	return (
		<ShowcaseSection
			title="AreaChart"
			description="Area chart component for filled trends"
			tags={['data', 'chart', 'area', 'trend', 'visualization']}
		>
			<AreaChart
				data={CHART_DATA}
				title="Area Trends"
				dataKey="value"
				colorScheme="primary"
				height={300}
			/>
		</ShowcaseSection>
	);
}
