import type { ReactNode } from 'react';

import { MENU_STYLES } from './ComboboxContentHelpers';

interface ComboboxEmptyStateProps {
	readonly emptyState: ReactNode;
}

export function ComboboxEmptyState({ emptyState }: Readonly<ComboboxEmptyStateProps>) {
	return (
		<div className={MENU_STYLES.EMPTY_STATE} aria-live="polite">
			{emptyState}
		</div>
	);
}
