import Text from '@core/ui/text/Text';
import { MotionFade } from '@core/ui/utilities/motion/components/MotionFade';

export function MotionFadeShowcase() {
	return (
		<div className="space-y-2">
			<Text size="sm" className="font-semibold">
				MotionFade - Fade Animation Component
			</Text>
			<MotionFade
				variant="fade"
				initial={false}
				className="p-4 bg-warning-100 dark:bg-warning-900 rounded-lg"
			>
				<Text>Dedicated fade animation component</Text>
			</MotionFade>
		</div>
	);
}
