import Text from '@core/ui/text/Text';
import Resizable from '@core/ui/utilities/resizable/Resizable';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderResizableShowcase() {
	return (
		<ShowcaseSection
			title="Resizable"
			description="Resizable panels/containers"
			tags={['utility', 'resize', 'panel', 'layout']}
		>
			<div className="space-y-4">
				<Resizable direction="horizontal" defaultSize="50%" minSize={100} maxSize="80%">
					<div className="h-32 bg-primary-100 dark:bg-primary-900 p-4 rounded-lg flex items-center justify-center">
						<Text>Resizable Panel - Drag the handle to resize</Text>
					</div>
				</Resizable>
				<Resizable direction="vertical" defaultSize="150px" minSize={100} maxSize={300}>
					<div className="bg-secondary-100 dark:bg-secondary-900 p-4 rounded-lg">
						<Text>Vertical Resizable Panel</Text>
					</div>
				</Resizable>
			</div>
		</ShowcaseSection>
	);
}
