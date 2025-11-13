import { MENU_STYLES } from '@core/ui/forms/combobox/helpers/ComboboxContentHelpers';
import type { ReactNode } from 'react';

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
