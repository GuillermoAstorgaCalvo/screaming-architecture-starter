import BottomNavigation from '@core/ui/navigation/bottom-navigation/BottomNavigation';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';
import { useState } from 'react';

export function BottomNavigationShowcase() {
	const [activeBottomNav, setActiveBottomNav] = useState('home');

	return (
		<ShowcaseSection
			title="BottomNavigation"
			description="Bottom navigation component"
			tags={['navigation', 'bottom', 'mobile']}
		>
			<BottomNavigation
				items={[
					{ id: 'home', label: 'Home', icon: '🏠' },
					{ id: 'search', label: 'Search', icon: '🔍' },
					{ id: 'profile', label: 'Profile', icon: '👤' },
				]}
				activeItemId={activeBottomNav}
				onItemChange={setActiveBottomNav}
			/>
		</ShowcaseSection>
	);
}
