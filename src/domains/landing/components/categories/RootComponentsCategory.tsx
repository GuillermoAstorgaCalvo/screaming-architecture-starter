import Heading from '@core/ui/heading/Heading';
import Text from '@core/ui/text/Text';

import { AccordionShowcase } from './root-components/AccordionShowcase';
import { AffixShowcase } from './root-components/AffixShowcase';
import { ButtonShowcase } from './root-components/ButtonShowcase';
import { CalendarShowcase } from './root-components/CalendarShowcase';
import { CollapsibleShowcase } from './root-components/CollapsibleShowcase';
import { ErrorBoundaryShowcase } from './root-components/ErrorBoundaryShowcase';
import { HeadingShowcase } from './root-components/HeadingShowcase';
import { IconButtonShowcase } from './root-components/IconButtonShowcase';
import { IconsShowcase } from './root-components/IconsShowcase';
import { LanguageSelectorFlagShowcase } from './root-components/LanguageSelectorFlagShowcase';
import { LanguageSelectorShowcase } from './root-components/LanguageSelectorShowcase';
import { SplitButtonShowcase } from './root-components/SplitButtonShowcase';
import { TextShowcase } from './root-components/TextShowcase';

/**
 * RootComponentsCategory - Showcase for root-level UI components
 */
export default function RootComponentsCategory() {
	return (
		<div className="space-y-8">
			<div>
				<Heading as="h1" size="lg" className="mb-2 text-white">
					Root Components
				</Heading>
				<Text className="text-white/70">
					Cross-cutting building blocks and foundational UI components
				</Text>
			</div>

			<ButtonShowcase />
			<IconButtonShowcase />
			<SplitButtonShowcase />
			<HeadingShowcase />
			<TextShowcase />
			<AccordionShowcase />
			<CollapsibleShowcase />
			<LanguageSelectorShowcase />
			<LanguageSelectorFlagShowcase />
			<AffixShowcase />
			<CalendarShowcase />
			<ErrorBoundaryShowcase />
			<IconsShowcase />
		</div>
	);
}
