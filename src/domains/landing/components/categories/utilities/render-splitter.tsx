import Text from '@core/ui/text/Text';
import { SplitterPanel } from '@core/ui/utilities/splitter/components/SplitterPanel';
import Splitter from '@core/ui/utilities/splitter/Splitter';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderSplitterShowcase() {
	return (
		<ShowcaseSection
			title="Splitter"
			description="Resizable panels with multiple panels support"
			tags={['utility', 'splitter', 'resize', 'panel', 'layout']}
		>
			<div className="space-y-4">
				<Splitter orientation="horizontal" className="h-64 border border-border rounded-lg">
					<SplitterPanel id="left" defaultSize="30%">
						<div className="h-full bg-primary-100 dark:bg-primary-900 p-4 flex items-center justify-center">
							<Text>Left Panel (30%)</Text>
						</div>
					</SplitterPanel>
					<SplitterPanel id="right" defaultSize="70%">
						<div className="h-full bg-secondary-100 dark:bg-secondary-900 p-4 flex items-center justify-center">
							<Text>Right Panel (70%)</Text>
						</div>
					</SplitterPanel>
				</Splitter>
				<Text size="sm" className="text-muted-foreground">
					Drag the handle between panels to resize
				</Text>
			</div>
		</ShowcaseSection>
	);
}
