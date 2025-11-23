import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

import type { LoadingState } from './constants/constants';
import { LoadingWrapperButtons } from './LoadingWrapperButtons';
import { LoadingWrapperContent } from './LoadingWrapperContent';

interface LoadingWrapperShowcaseProps {
	readonly loadingState: LoadingState;
	readonly setLoadingState: (state: LoadingState) => void;
}

/**
 * LoadingWrapperShowcase - Showcase for LoadingWrapper component
 */
export function LoadingWrapperShowcase({
	loadingState,
	setLoadingState,
}: LoadingWrapperShowcaseProps) {
	return (
		<ShowcaseSection
			title="LoadingWrapper"
			description="Unified component for loading, error, empty, and success states"
			tags={['utility', 'loading', 'error', 'state']}
		>
			<div className="space-y-4">
				<LoadingWrapperButtons setLoadingState={setLoadingState} />
				<LoadingWrapperContent loadingState={loadingState} setLoadingState={setLoadingState} />
			</div>
		</ShowcaseSection>
	);
}
