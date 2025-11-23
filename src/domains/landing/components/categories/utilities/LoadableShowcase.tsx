import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function LoadableShowcase() {
	return (
		<ShowcaseSection
			title="Loadable"
			description="Code splitting wrapper"
			tags={['utility', 'code-splitting', 'loading', 'lazy']}
		>
			<Text>Loadable is used for code splitting. Example usage:</Text>
			<Text size="sm" className="mt-2 text-muted-foreground">
				{`const MyComponent = Loadable({
  loader: () => import(&apos;./MyComponent&apos;),
  loading: <Spinner />
});`}
			</Text>
		</ShowcaseSection>
	);
}
