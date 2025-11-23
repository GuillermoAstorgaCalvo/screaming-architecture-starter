import Button from '@core/ui/button/Button';
import Text from '@core/ui/text/Text';
import { AnimatePresence } from '@core/ui/utilities/motion/components/AnimatePresence';
import { MotionBox } from '@core/ui/utilities/motion/MotionBox';

interface AnimatePresenceShowcaseProps {
	readonly motionVisible: boolean;
	readonly setMotionVisible: (value: boolean) => void;
}

export function AnimatePresenceShowcase({
	motionVisible,
	setMotionVisible,
}: AnimatePresenceShowcaseProps) {
	return (
		<div className="space-y-2">
			<Text size="sm" className="font-semibold">
				AnimatePresence - Exit Animations
			</Text>
			<Button onClick={() => setMotionVisible(!motionVisible)}>
				{motionVisible ? 'Hide' : 'Show'} Content
			</Button>
			<AnimatePresence mode="wait">
				{motionVisible ? (
					<MotionBox
						key="content"
						variant="fade"
						initial={false}
						className="p-4 bg-info-100 dark:bg-info-900 rounded-lg"
					>
						<Text>This content fades out when hidden</Text>
					</MotionBox>
				) : null}
			</AnimatePresence>
		</div>
	);
}
