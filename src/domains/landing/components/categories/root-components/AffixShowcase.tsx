import Affix from '@core/ui/affix/Affix';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function AffixShowcase() {
	return (
		<ShowcaseSection
			title="Affix"
			description="Affix/sticky component"
			tags={['affix', 'sticky', 'scroll']}
		>
			<div className="relative h-64 overflow-auto rounded-lg border border-border bg-surface p-4 dark:border-border dark:bg-surface">
				<Text className="mb-4">Scroll to see affix behavior</Text>
				<div className="h-96">
					<Text>Content above affix</Text>
					<Affix position="top" offset={0}>
						<div className="rounded-lg border border-border bg-surface p-2 dark:border-border dark:bg-surface">
							<Text size="sm">Sticky header (affix)</Text>
						</div>
					</Affix>
					<div className="mt-4 space-y-4">
						<Text>More content...</Text>
						<Text>More content...</Text>
						<Text>More content...</Text>
					</div>
				</div>
			</div>
		</ShowcaseSection>
	);
}
