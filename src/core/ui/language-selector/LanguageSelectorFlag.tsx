import { createLanguageSelectorFlagTrigger } from '@core/ui/language-selector/helpers/languageSelectorFlag.helpers';
import { useLanguageSelectorFlag } from '@core/ui/language-selector/hooks/useLanguageSelectorFlag';
import DropdownMenu from '@core/ui/overlays/dropdown-menu/DropdownMenu';
import type { LanguageSelectorFlagProps } from '@src-types/ui/languageSelector';
import { useMemo, useState } from 'react';

/**
 * LanguageSelectorFlag - Dropdown component for selecting application language with flag emojis
 *
 * Features:
 * - Accessible: proper ARIA attributes and keyboard navigation
 * - Shows country flags with language names
 * - Size variants: sm, md, lg
 * - Shows current language with flag
 * - Dark mode support
 * - Automatically updates when language changes
 *
 * @example
 * ```tsx
 * <LanguageSelectorFlag />
 * ```
 *
 * @example
 * ```tsx
 * <LanguageSelectorFlag
 *   size="sm"
 *   showLabel={false}
 *   ariaLabel="Choose your language"
 * />
 * ```
 */
export default function LanguageSelectorFlag({
	ariaLabel,
	className,
	size = 'md',
	showLabel = true,
}: Readonly<LanguageSelectorFlagProps>) {
	const [isOpen, setIsOpen] = useState(false);

	const { currentLanguageInfo, menuItems, t } = useLanguageSelectorFlag(() => {
		setIsOpen(false);
	});

	const trigger = useMemo(
		() =>
			createLanguageSelectorFlagTrigger({
				currentLanguageName: currentLanguageInfo.name,
				currentLanguageFlag: currentLanguageInfo.flag,
				showLabel,
				isOpen,
				size,
				ariaLabel,
				t,
				className,
			}),
		[currentLanguageInfo, showLabel, isOpen, size, ariaLabel, t, className]
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
