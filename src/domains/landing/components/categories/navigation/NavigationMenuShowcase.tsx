import NavigationMenu from '@core/ui/navigation/navigation-menu/NavigationMenu';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';
import { useState } from 'react';

export function NavigationMenuShowcase() {
	const [activeNavItem, setActiveNavItem] = useState('home');

	return (
		<ShowcaseSection
			title="NavigationMenu"
			description="Navigation menu component"
			tags={['navigation', 'menu']}
		>
			<NavigationMenu
				items={[
					{ id: 'home', label: 'Home', to: '/' },
					{ id: 'about', label: 'About', to: '/about' },
					{ id: 'contact', label: 'Contact', to: '/contact' },
				]}
				activeItemId={activeNavItem}
				onItemChange={setActiveNavItem}
			/>
		</ShowcaseSection>
	);
}
