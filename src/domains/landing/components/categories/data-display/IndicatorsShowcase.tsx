import { MeterShowcase } from './indicators/MeterShowcase';
import { StatusIndicatorShowcase } from './indicators/StatusIndicatorShowcase';
import { TimelineShowcase } from './indicators/TimelineShowcase';

export function IndicatorsShowcase() {
	return (
		<div className="space-y-8">
			<MeterShowcase />
			<StatusIndicatorShowcase />
			<TimelineShowcase />
		</div>
	);
}
