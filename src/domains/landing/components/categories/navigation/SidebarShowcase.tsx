import Button from '@core/ui/button/Button';
import Sidebar from '@core/ui/navigation/sidebar/Sidebar';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';
import { useState } from 'react';

export function SidebarShowcase() {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<ShowcaseSection
			title="Sidebar"
			description="Sidebar component"
			tags={['navigation', 'sidebar', 'panel', 'layout']}
		>
			<div className="flex flex-wrap gap-4">
				<Button variant="primary" onClick={() => setSidebarOpen(!sidebarOpen)}>
					Toggle Sidebar
				</Button>
				<Sidebar collapsed={!sidebarOpen} onCollapseChange={setSidebarOpen}>
					<Text>Sidebar content goes here</Text>
				</Sidebar>
			</div>
		</ShowcaseSection>
	);
}
