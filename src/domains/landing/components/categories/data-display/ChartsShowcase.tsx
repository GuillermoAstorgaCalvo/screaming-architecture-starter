import { AreaChartShowcase } from './charts/AreaChartShowcase';
import { BarChartShowcase } from './charts/BarChartShowcase';
import { LineChartShowcase } from './charts/LineChartShowcase';
import { PieChartShowcase } from './charts/PieChartShowcase';

export function ChartsShowcase() {
	return (
		<div className="space-y-8">
			<BarChartShowcase />
			<LineChartShowcase />
			<AreaChartShowcase />
			<PieChartShowcase />
		</div>
	);
}
