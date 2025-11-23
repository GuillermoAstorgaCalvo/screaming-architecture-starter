import Button from '@core/ui/button/Button';
import Text from '@core/ui/text/Text';
import { MotionAccordion } from '@core/ui/utilities/motion/components/MotionAccordion';

interface MotionAccordionShowcaseProps {
	readonly motionAccordionOpen: boolean;
	readonly setMotionAccordionOpen: (value: boolean) => void;
}

export function MotionAccordionShowcase({
	motionAccordionOpen,
	setMotionAccordionOpen,
}: MotionAccordionShowcaseProps) {
	return (
		<div className="space-y-2">
			<Text size="sm" className="font-semibold">
				MotionAccordion - Animated Accordion Panel
			</Text>
			<Button onClick={() => setMotionAccordionOpen(!motionAccordionOpen)}>
				{motionAccordionOpen ? 'Collapse' : 'Expand'} Accordion
			</Button>
			<MotionAccordion
				isOpen={motionAccordionOpen}
				className="rounded-lg border border-border bg-surface p-4"
			>
				<Text>This accordion content animates in and out with height transitions.</Text>
			</MotionAccordion>
		</div>
	);
}
