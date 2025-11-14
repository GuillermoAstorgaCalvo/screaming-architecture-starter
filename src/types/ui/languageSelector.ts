/**
 * LanguageSelector component props
 */
export interface LanguageSelectorProps {
	/**
	 * Optional custom label for screen readers
	 * @default 'Language selector'
	 */
	readonly ariaLabel?: string;
	/**
	 * Custom className for styling
	 */
	readonly className?: string;
	/**
	 * Size variant
	 * @default 'md'
	 */
	readonly size?: 'sm' | 'md' | 'lg';
	/**
	 * Show language name in trigger button
	 * @default true
	 */
	readonly showLabel?: boolean;
}

/**
 * LanguageSelectorFlag component props
 */
export interface LanguageSelectorFlagProps {
	/**
	 * Optional custom label for screen readers
	 * @default 'Language selector'
	 */
	readonly ariaLabel?: string;
	/**
	 * Custom className for styling
	 */
	readonly className?: string;
	/**
	 * Size variant
	 * @default 'md'
	 */
	readonly size?: 'sm' | 'md' | 'lg';
	/**
	 * Show language name in trigger button
	 * @default true
	 */
	readonly showLabel?: boolean;
}
