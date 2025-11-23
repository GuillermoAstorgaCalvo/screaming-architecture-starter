import Text from '@core/ui/text/Text';
import { MotionSlide } from '@core/ui/utilities/motion/components/MotionSlide';

export function MotionSlideShowcase() {
	return (
		<div className="space-y-2">
			<Text size="sm" className="font-semibold">
				MotionSlide - Slide Animation Component
			</Text>
			<MotionSlide
				direction="left"
				initial={false}
				className="p-4 bg-error-100 dark:bg-error-900 rounded-lg"
			>
				<Text>Dedicated slide animation component (slides from left)</Text>
			</MotionSlide>
		</div>
	);
}
