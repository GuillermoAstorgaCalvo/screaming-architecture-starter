import Button from '@core/ui/button/Button';
import HoverCard from '@core/ui/overlays/hover-card/HoverCard';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function HoverCardShowcase() {
	return (
		<ShowcaseSection
			title="HoverCard"
			description="Hover card component"
			tags={['overlay', 'hover', 'card', 'tooltip']}
		>
			<HoverCard content={<Text>This is hover card content</Text>} position="top">
				<Button variant="ghost">Hover me</Button>
			</HoverCard>
		</ShowcaseSection>
	);
}
