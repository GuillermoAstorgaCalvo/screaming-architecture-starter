import { useTranslation } from '@core/i18n/useTranslation';
import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import LoadingWrapper from '@core/ui/utilities/loading-wrapper/LoadingWrapper';

import type { LoadingState } from './constants/constants';

interface LoadingWrapperContentProps {
	readonly loadingState: LoadingState;
	readonly setLoadingState: (state: LoadingState) => void;
}

/**
 * LoadingWrapperContent - Content wrapper with loading states
 */
export function LoadingWrapperContent({
	loadingState,
	setLoadingState,
}: LoadingWrapperContentProps) {
	const { t } = useTranslation('common');

	return (
		<LoadingWrapper
			isLoading={loadingState === 'loading'}
			error={loadingState === 'error' ? t('errors.errorBoundary.title') : null}
			onRetry={loadingState === 'error' ? () => setLoadingState('success') : undefined}
			isEmpty={loadingState === 'empty'}
			emptyMessage={t('noDataAvailable')}
		>
			<Card variant="outlined" padding="md">
				<Text>Content loaded successfully</Text>
			</Card>
		</LoadingWrapper>
	);
}
