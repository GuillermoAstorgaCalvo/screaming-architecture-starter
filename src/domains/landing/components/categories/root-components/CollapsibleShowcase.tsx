import Collapsible from '@core/ui/collapsible/Collapsible';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';
import { useState } from 'react';

export function CollapsibleShowcase() {
	const [collapsibleOpen, setCollapsibleOpen] = useState(false);

	return (
		<ShowcaseSection
			title="Collapsible"
			description="Collapsible panel component"
			tags={['collapse', 'expand', 'panel']}
		>
			<Collapsible
				header="Toggle Collapsible"
				expanded={collapsibleOpen}
				onExpandedChange={setCollapsibleOpen}
			>
				<Text>This is collapsible content that can be shown or hidden.</Text>
			</Collapsible>
		</ShowcaseSection>
	);
}
