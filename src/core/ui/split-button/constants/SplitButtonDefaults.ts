/**
 * Default prop values for SplitButton
 *
 * @internal
 */
import i18n from '@core/i18n/i18n';

export const DEFAULT_PROPS = {
	variant: 'primary' as const,
	size: 'md' as const,
	isLoading: false,
	menuAlign: 'end' as const,
	get dropdownAriaLabel() {
		return i18n.t('a11y.moreOptions', { ns: 'common' });
	},
	type: 'button' as const,
} as const;
