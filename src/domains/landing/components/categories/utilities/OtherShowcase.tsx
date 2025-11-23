import { CopyButtonShowcase } from '@domains/landing/components/categories/utilities/CopyButtonShowcase';
import { LoadableShowcase } from '@domains/landing/components/categories/utilities/LoadableShowcase';
import { LoadingWrapperShowcase } from '@domains/landing/components/categories/utilities/LoadingWrapperShowcase';

import type { LoadingState } from './constants/constants';

interface OtherShowcaseProps {
	readonly loadingState: LoadingState;
	readonly setLoadingState: (state: LoadingState) => void;
}

export function OtherShowcase({ loadingState, setLoadingState }: OtherShowcaseProps) {
	return (
		<div className="space-y-8">
			<CopyButtonShowcase />
			<LoadingWrapperShowcase loadingState={loadingState} setLoadingState={setLoadingState} />
			<LoadableShowcase />
		</div>
	);
}
