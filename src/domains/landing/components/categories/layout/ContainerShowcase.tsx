import Container from '@core/ui/layout/container/Container';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function ContainerShowcase() {
	return (
		<ShowcaseSection
			title="Container"
			description="Container component"
			tags={['layout', 'container']}
		>
			<Container className="rounded-lg border border-border bg-surface p-4 dark:border-border dark:bg-surface">
				<Text>This is content inside a Container component.</Text>
			</Container>
		</ShowcaseSection>
	);
}
