import type { TypedTFunction } from '@core/i18n/useTranslation';
import {
	FLAG_SIZE_CLASSES,
	type LanguageSelectorSize,
	SIZE_CLASSES_WITH_GAP,
} from '@core/ui/language-selector/constants/languageSelector.constants';
import { classNames } from '@core/utils/classNames';
import type { ReactElement } from 'react';

export interface CreateTriggerFlagParams {
	readonly currentLanguageName: string;
	readonly currentLanguageFlag: string;
	readonly showLabel: boolean;
	readonly isOpen: boolean;
	readonly size: LanguageSelectorSize;
	readonly ariaLabel: string | undefined;
	readonly t: TypedTFunction<'common'>;
	readonly className?: string | undefined;
}

/**
 * Creates the trigger button for the language selector flag dropdown
 */
export function createLanguageSelectorFlagTrigger({
	currentLanguageName,
	currentLanguageFlag,
	showLabel,
	isOpen,
	size,
	ariaLabel,
	t,
	className,
}: CreateTriggerFlagParams): ReactElement {
	const baseClasses =
		'inline-flex items-center rounded-lg border border-border bg-surface px-3 py-2 font-medium text-text-primary transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-border dark:bg-surface dark:text-text-primary dark:hover:bg-muted dark:focus:ring-offset-surface';
	const buttonClasses = classNames(baseClasses, SIZE_CLASSES_WITH_GAP[size], className);
	const flagClasses = classNames('inline-flex items-center', FLAG_SIZE_CLASSES[size]);
	const iconClasses = classNames('h-4 w-4 transition-transform shrink-0', isOpen && 'rotate-180');

	return (
		<button
			type="button"
			aria-label={ariaLabel ?? t('a11y.languageSelector')}
			aria-expanded={isOpen}
			aria-haspopup="true"
			className={buttonClasses}
		>
			<span className={flagClasses} aria-hidden="true">
				{currentLanguageFlag}
			</span>
			{showLabel ? <span className="sr-only sm:not-sr-only">{currentLanguageName}</span> : null}
			<svg
				className={iconClasses}
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
