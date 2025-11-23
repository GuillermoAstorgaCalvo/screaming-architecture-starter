import BarChart from '@core/ui/data-display/chart/bar-chart/BarChart';
import { CHART_DATA } from '@domains/landing/components/categories/data-display/constants/constants';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function BarChartShowcase() {
	return (
		<ShowcaseSection
			title="BarChart"
			description="Bar chart component for data visualization"
			tags={['data', 'chart', 'bar', 'visualization']}
		>
			<BarChart
				data={CHART_DATA}
				title="Monthly Sales"
				dataKey="value"
				colorScheme="primary"
				height={300}
			/>
		</ShowcaseSection>
	);
}
