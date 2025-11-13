import type { LoadingWrapperStateParams } from '@core/ui/utilities/loading-wrapper/types/LoadingWrapperHelpers.state.types';
import type { ReactNode } from 'react';

type OptionalStateProps = Readonly<{
	onRetry?: (() => void) | undefined;
	emptyMessage?: string | ReactNode;
	loadingComponent?: ReactNode;
	skeletonComponent?: ReactNode;
	errorComponent?: ReactNode;
	loadingText?: string;
	emptyDescription?: string;
	emptyActionLabel?: string;
	onEmptyAction?: (() => void) | undefined;
	children?: ReactNode;
	className?: string | undefined;
}>;

type OptionalStatePropsKeys =
	| 'onRetry'
	| 'emptyMessage'
	| 'loadingComponent'
	| 'skeletonComponent'
	| 'errorComponent'
	| 'loadingText'
	| 'emptyDescription'
	| 'emptyActionLabel'
	| 'onEmptyAction'
	| 'children'
	| 'className';

/** Create entries array from optional state props */
function createOptionalPropsEntries(props: OptionalStateProps) {
	return [
		['onRetry', props.onRetry],
		['emptyMessage', props.emptyMessage],
		['loadingComponent', props.loadingComponent],
		['skeletonComponent', props.skeletonComponent],
		['errorComponent', props.errorComponent],
		['loadingText', props.loadingText],
		['emptyDescription', props.emptyDescription],
		['emptyActionLabel', props.emptyActionLabel],
		['onEmptyAction', props.onEmptyAction],
		['children', props.children],
		['className', props.className],
	] as const;
}

/** Filter out entries with undefined values */
function filterDefinedEntries(
	entries: ReadonlyArray<readonly [string, unknown]>
): Array<[string, unknown]> {
	return entries.filter(([, value]) => value !== undefined) as Array<[string, unknown]>;
}

/** Convert entries to typed partial object */
function entriesToOptionalStateProps(
	entries: Array<[string, unknown]>
): Partial<Pick<LoadingWrapperStateParams, OptionalStatePropsKeys>> {
	return Object.fromEntries(entries) as Partial<
		Pick<LoadingWrapperStateParams, OptionalStatePropsKeys>
	>;
}

/** Build optional properties object for state params */
export function buildOptionalStateProps(props: OptionalStateProps) {
	const entries = createOptionalPropsEntries(props);
	const definedEntries = filterDefinedEntries(entries);
	return entriesToOptionalStateProps(definedEntries);
}
