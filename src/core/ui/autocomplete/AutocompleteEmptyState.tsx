import type { ReactNode } from 'react';

import { MENU_STYLES } from './AutocompleteContentHelpers';

interface AutocompleteEmptyStateProps {
	readonly emptyState: ReactNode;
}

export function AutocompleteEmptyState({ emptyState }: Readonly<AutocompleteEmptyStateProps>) {
	return (
		<div className={MENU_STYLES.EMPTY_STATE} aria-live="polite">
			{emptyState}
		</div>
	);
}
