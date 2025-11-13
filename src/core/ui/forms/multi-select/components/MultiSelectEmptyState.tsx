import { MENU_STYLES } from '@core/ui/forms/multi-select/helpers/MultiSelectContentHelpers';
import type { ReactNode } from 'react';

export function MultiSelectEmptyState({ emptyState }: Readonly<{ emptyState: ReactNode }>) {
	return (
		<div className={MENU_STYLES.EMPTY_STATE} aria-live="polite">
			{emptyState}
		</div>
	);
}
