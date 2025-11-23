import Heading from '@core/ui/heading/Heading';
import Text from '@core/ui/text/Text';

import { AspectRatioShowcase } from './layout/AspectRatioShowcase';
import { BoxShowcase } from './layout/BoxShowcase';
import { ContainerShowcase } from './layout/ContainerShowcase';
import { DividerShowcase } from './layout/DividerShowcase';
import { FlexShowcase } from './layout/FlexShowcase';
import { GridShowcase } from './layout/GridShowcase';
import { SeparatorShowcase } from './layout/SeparatorShowcase';
import { StackShowcase } from './layout/StackShowcase';

/**
 * LayoutCategory - Showcase for layout components
 */
export default function LayoutCategory() {
	return (
		<div className="space-y-8">
			<div>
				<Heading as="h1" size="lg" className="mb-2 text-white">
					Layout
				</Heading>
				<Text className="text-white/70">
					Layout primitives and structural components for organizing content
				</Text>
			</div>

			<BoxShowcase />
			<FlexShowcase />
			<GridShowcase />
			<StackShowcase />
			<ContainerShowcase />
			<DividerShowcase />
			<AspectRatioShowcase />
			<SeparatorShowcase />
		</div>
	);
}
