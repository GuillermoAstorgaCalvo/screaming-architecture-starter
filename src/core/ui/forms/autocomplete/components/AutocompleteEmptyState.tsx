import { MENU_STYLES } from '@core/ui/forms/autocomplete/helpers/AutocompleteContentHelpers';
import type { ReactNode } from 'react';

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
