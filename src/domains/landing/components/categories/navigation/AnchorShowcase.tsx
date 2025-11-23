import Anchor from '@core/ui/navigation/anchor/Anchor';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function AnchorShowcase() {
	return (
		<ShowcaseSection
			title="Anchor"
			description="Anchor component for hash navigation"
			tags={['navigation', 'anchor', 'link', 'hash']}
		>
			<div className="flex flex-wrap gap-4">
				<Anchor href="#section1">Link to Section 1</Anchor>
				<Anchor href="#section2">Link to Section 2</Anchor>
			</div>
		</ShowcaseSection>
	);
}
