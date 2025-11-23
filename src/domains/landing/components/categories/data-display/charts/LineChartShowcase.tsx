import LineChart from '@core/ui/data-display/chart/line-chart/LineChart';
import { CHART_DATA } from '@domains/landing/components/categories/data-display/constants/constants';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function LineChartShowcase() {
	return (
		<ShowcaseSection
			title="LineChart"
			description="Line chart component for trends"
			tags={['data', 'chart', 'line', 'trend', 'visualization']}
		>
			<LineChart
				data={CHART_DATA}
				title="Monthly Trends"
				dataKey="value"
				colorScheme="primary"
				height={300}
			/>
		</ShowcaseSection>
	);
}
