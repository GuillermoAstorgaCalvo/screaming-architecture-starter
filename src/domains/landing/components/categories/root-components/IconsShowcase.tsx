import IconShowcase from '@domains/landing/components/shared/IconShowcase';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function IconsShowcase() {
	return (
		<ShowcaseSection
			title="Icons"
			description="Comprehensive icon gallery from Lucide React - search, filter, and copy icon names"
			tags={['icon', 'lucide', 'gallery', 'search']}
		>
			<IconShowcase description="Browse and search through available icons. Click the copy button to copy the icon name for use in your code." />
		</ShowcaseSection>
	);
}
