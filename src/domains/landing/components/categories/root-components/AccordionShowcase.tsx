import Accordion from '@core/ui/accordion/Accordion';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function AccordionShowcase() {
	return (
		<ShowcaseSection
			title="Accordion"
			description="Expandable/collapsible accordion component"
			tags={['accordion', 'collapse', 'expand']}
		>
			<Accordion
				allowMultiple
				items={[
					{
						id: 'item1',
						header: 'Accordion Item 1',
						content: <Text>Content for accordion item 1</Text>,
					},
					{
						id: 'item2',
						header: 'Accordion Item 2',
						content: <Text>Content for accordion item 2</Text>,
					},
					{
						id: 'item3',
						header: 'Accordion Item 3',
						content: <Text>Content for accordion item 3</Text>,
					},
				]}
			/>
		</ShowcaseSection>
	);
}
