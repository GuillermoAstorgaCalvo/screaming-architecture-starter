import Box from '@core/ui/layout/box/Box';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function BoxShowcase() {
	return (
		<ShowcaseSection
			title="Box"
			description="Box container component"
			tags={['layout', 'box', 'container']}
		>
			<Box className="rounded-lg border border-border bg-surface p-4 dark:border-border dark:bg-surface">
				<Text>This is content inside a Box component.</Text>
			</Box>
		</ShowcaseSection>
	);
}
