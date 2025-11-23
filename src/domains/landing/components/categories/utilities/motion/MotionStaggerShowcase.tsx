import Text from '@core/ui/text/Text';
import { MotionList } from '@core/ui/utilities/motion/components/MotionList';
import { MotionStagger } from '@core/ui/utilities/motion/components/MotionStagger';
import { MotionBox } from '@core/ui/utilities/motion/MotionBox';

interface MotionStaggerShowcaseProps {
	readonly motionListItems: string[];
}

export function MotionStaggerShowcase({ motionListItems }: MotionStaggerShowcaseProps) {
	return (
		<>
			<div className="space-y-2">
				<Text size="sm" className="font-semibold">
					MotionStagger - Staggered Animations
				</Text>
				<MotionStagger staggerDelay={0.1} delayChildren={0.1}>
					<div className="space-y-2">
						{motionListItems.map(item => (
							<MotionBox
								key={item}
								variant="fade"
								initial={false}
								className="p-2 bg-primary-100 dark:bg-primary-900 rounded"
							>
								<Text size="sm">{item}</Text>
							</MotionBox>
						))}
					</div>
				</MotionStagger>
			</div>
			<div className="space-y-2">
				<Text size="sm" className="font-semibold">
					MotionList - List with Staggered Entrances
				</Text>
				<MotionList
					items={motionListItems}
					renderItem={item => (
						<div className="p-2 bg-secondary-100 dark:bg-secondary-900 rounded mb-2">
							<Text size="sm">{item}</Text>
						</div>
					)}
					itemVariant="fade"
					staggerDelay={0.1}
				/>
			</div>
		</>
	);
}
