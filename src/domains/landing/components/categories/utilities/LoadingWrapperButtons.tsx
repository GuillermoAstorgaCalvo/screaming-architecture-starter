import Button from '@core/ui/button/Button';

import type { LoadingState } from './constants/constants';

interface LoadingWrapperButtonsProps {
	readonly setLoadingState: (state: LoadingState) => void;
}

/**
 * LoadingWrapperButtons - Control buttons for switching between loading states
 */
export function LoadingWrapperButtons({ setLoadingState }: LoadingWrapperButtonsProps) {
	return (
		<div className="flex gap-2">
			<Button variant="primary" size="sm" onClick={() => setLoadingState('loading')}>
				Loading
			</Button>
			<Button variant="secondary" size="sm" onClick={() => setLoadingState('error')}>
				Error
			</Button>
			<Button variant="secondary" size="sm" onClick={() => setLoadingState('empty')}>
				Empty
			</Button>
			<Button variant="secondary" size="sm" onClick={() => setLoadingState('success')}>
				Success
			</Button>
		</div>
	);
}
