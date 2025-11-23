import Code from '@core/ui/data-display/code/Code';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function CodeShowcase() {
	return (
		<ShowcaseSection
			title="Code"
			description="Inline code display component"
			tags={['data', 'code', 'text']}
		>
			<div className="space-y-2">
				<Text>
					Use <Code>console.log()</Code> to debug your code.
				</Text>
				<Text>
					The <Code>useState</Code> hook manages component state.
				</Text>
			</div>
		</ShowcaseSection>
	);
}
