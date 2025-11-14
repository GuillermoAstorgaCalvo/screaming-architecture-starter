import type { EmptyStateContentProps } from '@core/ui/feedback/empty-state/types/emptyState.types';
import Heading from '@core/ui/heading/Heading';
import Text from '@core/ui/text/Text';

export function EmptyStateContent({
	title,
	description,
	variantSize,
}: Readonly<EmptyStateContentProps>) {
	return (
		<>
			<Heading as="h3" size={variantSize}>
				{title}
			</Heading>
			{description == null ? null : (
				<Text size={variantSize} className="text-muted-foreground max-w-md">
					{description}
				</Text>
			)}
		</>
	);
}
