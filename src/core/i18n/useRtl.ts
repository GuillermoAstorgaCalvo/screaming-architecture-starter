import { useEffect, useState } from 'react';

import { isRtlLanguage as checkIsRtlLanguage } from './constants';
import i18n from './i18n';

/**
 * Hook to check if the current language is RTL (Right-to-Left)
 *
 * Automatically updates when the language changes.
 * The HTML `dir` attribute is managed automatically by the i18n system,
 * but this hook can be used for component-level RTL styling.
 *
 * @returns true if current language is RTL, false otherwise
 *
 * @example
 * ```tsx
 * const isRtl = useRtl();
 * return (
 *   <div className={isRtl ? 'rtl-container' : 'ltr-container'}>
 *     Content that adapts to direction
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * const isRtl = useRtl();
 * return (
 *   <div style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
 *     Content
 *   </div>
 * );
 * ```
 */
export function useRtl(): boolean {
	const [isRtl, setIsRtl] = useState(() => {
		return checkIsRtlLanguage(i18n.language);
	});

	useEffect(() => {
		const updateRtl = (lng: string) => {
			setIsRtl(checkIsRtlLanguage(lng));
		};

		// Set initial value
		updateRtl(i18n.language);

		// Listen for language changes
		i18n.on('languageChanged', updateRtl);

		return () => {
			i18n.off('languageChanged', updateRtl);
		};
	}, []);

	return isRtl;
}
