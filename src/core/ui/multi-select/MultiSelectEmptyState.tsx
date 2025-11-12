import type { ReactNode } from 'react';

import { MENU_STYLES } from './MultiSelectContentHelpers';

export function MultiSelectEmptyState({ emptyState }: Readonly<{ emptyState: ReactNode }>) {
	return (
		<div className={MENU_STYLES.EMPTY_STATE} aria-live="polite">
			{emptyState}
		</div>
	);
}
