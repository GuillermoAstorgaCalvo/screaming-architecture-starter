import { createLanguageSelectorTrigger } from '@core/ui/language-selector/helpers/languageSelector.helpers';
import { useLanguageSelector } from '@core/ui/language-selector/hooks/useLanguageSelector';
import DropdownMenu from '@core/ui/overlays/dropdown-menu/DropdownMenu';
import type { LanguageSelectorProps } from '@src-types/ui/languageSelector';
import { useMemo, useState } from 'react';

/**
 * LanguageSelector - Dropdown component for selecting application language
 *
 * Features:
 * - Accessible: proper ARIA attributes and keyboard navigation
 * - Size variants: sm, md, lg
 * - Shows current language
 * - Dark mode support
 * - Automatically updates when language changes
 *
 * @example
 * ```tsx
 * <LanguageSelector />
 * ```
 *
 * @example
 * ```tsx
 * <LanguageSelector
 *   size="sm"
 *   showLabel={false}
 *   ariaLabel="Choose your language"
 * />
 * ```
 */
export default function LanguageSelector({
	ariaLabel,
	className,
	size = 'md',
	showLabel = true,
}: Readonly<LanguageSelectorProps>) {
	const [isOpen, setIsOpen] = useState(false);

	const { currentLanguage, currentLanguageMetadata, menuItems, t } = useLanguageSelector(() => {
		setIsOpen(false);
	});

	const currentLanguageName = useMemo(() => {
		if (currentLanguageMetadata) {
			return t(`language.${currentLanguageMetadata.code}`);
		}
		return currentLanguage.toUpperCase();
	}, [currentLanguage, currentLanguageMetadata, t]);

	const trigger = useMemo(
		() =>
			createLanguageSelectorTrigger({
				currentLanguageName,
				showLabel,
				isOpen,
				size,
				ariaLabel,
				t,
				className,
			}),
		[currentLanguageName, showLabel, isOpen, size, ariaLabel, t, className]
	);

	return (
		<DropdownMenu
			trigger={trigger}
			items={menuItems}
			isOpen={isOpen}
			onOpenChange={setIsOpen}
			align="end"
			menuLabel={t('a11y.selectLanguage')}
		/>
	);
}
