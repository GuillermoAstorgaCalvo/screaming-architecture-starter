import Tabs from '@core/ui/navigation/tabs/Tabs';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';
import { useState } from 'react';

export function TabsShowcase() {
	const [activeTab, setActiveTab] = useState('tab1');

	return (
		<ShowcaseSection
			title="Tabs"
			description="Tabbed interface component"
			tags={['navigation', 'tabs', 'tab']}
		>
			<Tabs
				items={[
					{ id: 'tab1', label: 'Tab 1', content: <Text>Content for Tab 1</Text> },
					{ id: 'tab2', label: 'Tab 2', content: <Text>Content for Tab 2</Text> },
					{ id: 'tab3', label: 'Tab 3', content: <Text>Content for Tab 3</Text> },
				]}
				activeTabId={activeTab}
				onTabChange={setActiveTab}
			/>
		</ShowcaseSection>
	);
}
