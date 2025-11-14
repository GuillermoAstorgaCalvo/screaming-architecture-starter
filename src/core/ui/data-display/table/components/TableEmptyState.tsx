import type { ReactNode } from 'react';

// ============================================================================
// Empty State Component
// ============================================================================

type TableEmptyStateProps = Readonly<{
	emptyMessage: ReactNode;
}>;

export function TableEmptyState({ emptyMessage }: TableEmptyStateProps) {
	return (
		<div className="flex items-center justify-center p-8 text-text-muted dark:text-text-muted-dark">
			{emptyMessage}
		</div>
	);
}
