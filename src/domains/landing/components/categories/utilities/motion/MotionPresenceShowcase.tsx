import Button from '@core/ui/button/Button';
import Text from '@core/ui/text/Text';
import { MotionPresence } from '@core/ui/utilities/motion/components/MotionPresence';

interface MotionPresenceShowcaseProps {
	readonly motionPresenceVisible: boolean;
	readonly setMotionPresenceVisible: (value: boolean) => void;
}

export function MotionPresenceShowcase({
	motionPresenceVisible,
	setMotionPresenceVisible,
}: MotionPresenceShowcaseProps) {
	return (
		<div className="space-y-2">
			<Text size="sm" className="font-semibold">
				MotionPresence - Convenience Wrapper
			</Text>
			<Button onClick={() => setMotionPresenceVisible(!motionPresenceVisible)}>
				{motionPresenceVisible ? 'Hide' : 'Show'} Content
			</Button>
			<MotionPresence
				isPresent={motionPresenceVisible}
				variant="slide"
				className="p-4 bg-success-100 dark:bg-success-900 rounded-lg"
			>
				<Text>This content animates in/out with MotionPresence</Text>
			</MotionPresence>
		</div>
	);
}
