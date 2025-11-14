import Button from '@core/ui/button/Button';
import type { EmptyStateActionProps } from '@core/ui/feedback/empty-state/types/emptyState.types';

export function EmptyStateAction({
	actionLabel,
	onAction,
	variantSize,
	size,
}: Readonly<EmptyStateActionProps>) {
	if (actionLabel == null || onAction == null) return null;
	return (
		<div className={size === 'lg' ? 'mt-4' : 'mt-2'}>
			<Button variant="primary" size={variantSize} onClick={onAction}>
				{actionLabel}
			</Button>
		</div>
	);
}
