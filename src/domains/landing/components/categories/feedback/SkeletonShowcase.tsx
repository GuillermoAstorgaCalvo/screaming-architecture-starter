import Skeleton from '@core/ui/feedback/skeleton/Skeleton';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function SkeletonShowcase() {
	return (
		<ShowcaseSection
			title="Skeleton"
			description="Loading skeleton component"
			tags={['feedback', 'loading', 'skeleton']}
		>
			<div className="space-y-4">
				<Skeleton variant="text" className="h-4 w-full" />
				<Skeleton variant="text" className="h-4 w-3/4" />
				<div className="flex gap-4">
					<Skeleton variant="circular" className="h-12 w-12" />
					<div className="flex-1 space-y-2">
						<Skeleton variant="text" className="h-4 w-full" />
						<Skeleton variant="text" className="h-4 w-2/3" />
					</div>
				</div>
				<Skeleton variant="rectangular" className="h-32 w-full" />
			</div>
		</ShowcaseSection>
	);
}
