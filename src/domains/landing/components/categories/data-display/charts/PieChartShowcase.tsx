import PieChart from '@core/ui/data-display/chart/pie-chart/PieChart';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function PieChartShowcase() {
	return (
		<ShowcaseSection
			title="PieChart"
			description="Pie/donut chart component"
			tags={['data', 'chart', 'pie', 'donut', 'visualization']}
		>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<PieChart
					data={[
						{ name: 'Desktop', value: 400 },
						{ name: 'Mobile', value: 300 },
						{ name: 'Tablet', value: 200 },
					]}
					dataKey="value"
					title="Device Distribution"
					colorScheme="primary"
					height={300}
				/>
				<PieChart
					data={[
						{ name: 'Category A', value: 35 },
						{ name: 'Category B', value: 25 },
						{ name: 'Category C', value: 20 },
						{ name: 'Category D', value: 20 },
					]}
					dataKey="value"
					title="Donut Chart"
					innerRadius={60}
					outerRadius={80}
					colorScheme="primary"
					height={300}
				/>
			</div>
		</ShowcaseSection>
	);
}
