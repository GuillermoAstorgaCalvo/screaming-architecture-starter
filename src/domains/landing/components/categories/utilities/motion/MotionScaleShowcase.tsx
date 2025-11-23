import Text from '@core/ui/text/Text';
import { MotionScale } from '@core/ui/utilities/motion/components/MotionScale';

export function MotionScaleShowcase() {
	return (
		<div className="space-y-2">
			<Text size="sm" className="font-semibold">
				MotionScale - Scale Animation Component
			</Text>
			<MotionScale initial={false} className="p-4 bg-info-100 dark:bg-info-900 rounded-lg">
				<Text>Dedicated scale animation component</Text>
			</MotionScale>
		</div>
	);
}
