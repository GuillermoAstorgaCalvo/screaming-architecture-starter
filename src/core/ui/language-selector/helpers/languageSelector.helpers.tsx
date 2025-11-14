import type { TypedTFunction } from '@core/i18n/useTranslation';
import {
	type LanguageSelectorSize,
	SIZE_CLASSES,
} from '@core/ui/language-selector/constants/languageSelector.constants';
import { classNames } from '@core/utils/classNames';
import type { ReactElement } from 'react';

export interface CreateTriggerParams {
	readonly currentLanguageName: string;
	readonly showLabel: boolean;
	readonly isOpen: boolean;
	readonly size: LanguageSelectorSize;
	readonly ariaLabel: string | undefined;
	readonly t: TypedTFunction<'common'>;
	readonly className?: string | undefined;
}

/**
 * Creates the trigger button for the language selector dropdown
 */
export function createLanguageSelectorTrigger({
	currentLanguageName,
	showLabel,
	isOpen,
	size,
	ariaLabel,
	t,
	className,
}: CreateTriggerParams): ReactElement {
	return (
		<button
			type="button"
			aria-label={ariaLabel ?? t('a11y.languageSelector')}
			aria-expanded={isOpen}
			aria-haspopup="true"
			className={classNames(
				'inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-border dark:bg-surface dark:text-text-primary dark:hover:bg-muted dark:focus:ring-offset-surface',
				SIZE_CLASSES[size],
				className
			)}
		>
			<span className="sr-only sm:not-sr-only" aria-hidden={!showLabel}>
				{showLabel ? currentLanguageName : ''}
			</span>
			<svg
				className={classNames('h-4 w-4 transition-transform shrink-0', isOpen && 'rotate-180')}
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
			</svg>
		</button>
	);
}
