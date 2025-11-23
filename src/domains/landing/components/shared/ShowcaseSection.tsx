import Chip from '@core/ui/forms/chip/Chip';
import Heading from '@core/ui/heading/Heading';
import { useShowcaseFilter } from '@domains/landing/hooks/useShowcaseFilter';
import type { ReactNode } from 'react';

interface ShowcaseSectionProps {
	title: string;
	description?: string;
	children: ReactNode;
	tags?: readonly string[];
	/** Internal prop used for filtering - do not set manually */
	_shouldShow?: boolean;
}

function ShowcaseHeader({ title, tags }: Readonly<{ title: string; tags: readonly string[] }>) {
	return (
		<div className="mb-3 flex items-center gap-3 flex-wrap">
			<Heading as="h2" size="lg" className="text-white">
				{title}
			</Heading>
			{tags.length > 0 ? (
				<div className="flex flex-wrap gap-2">
					{tags.map(tag => (
						<Chip
							key={tag}
							size="sm"
							variant="primary"
							className="bg-primary/20 text-primary-foreground border border-primary/30"
						>
							{tag}
						</Chip>
					))}
				</div>
			) : null}
		</div>
	);
}

/**
 * ShowcaseSection - Wrapper component for showcasing individual implementations
 */
export default function ShowcaseSection({
	title,
	description,
	children,
	tags = [],
}: Readonly<ShowcaseSectionProps>) {
	const shouldShow = useShowcaseFilter(title, tags);

	if (!shouldShow) {
		return null;
	}

	return (
		<div
			className="glass rounded-2xl p-6 space-y-6 border border-white/10 shadow-lg"
			data-component-name={title}
		>
			<div>
				<ShowcaseHeader title={title} tags={tags} />
				{description ? (
					<p className="text-sm text-white/70 leading-relaxed">{description}</p>
				) : null}
			</div>
			<div className="rounded-xl glass-sm border border-white/5 p-6 backdrop-blur-sm">
				{children}
			</div>
		</div>
	);
}
