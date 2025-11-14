import { useTranslation } from '@core/i18n/useTranslation';
import { useCommandPaletteState } from '@core/ui/overlays/command-palette/hooks/useCommandPaletteState';
import { renderCommandPaletteContent } from '@core/ui/overlays/command-palette/renderers/renderCommandPaletteContent';
import type { CommandPaletteProps } from '@core/ui/overlays/command-palette/types/CommandPalette.types';
import { useId } from 'react';

/**
 * CommandPalette - Searchable command interface (like VS Code's command palette)
 *
 * Features:
 * - Accessible: proper ARIA attributes, focus management, keyboard navigation
 * - Searchable: filter commands by label, description, or keywords
 * - Keyboard navigation: arrow keys, enter, escape
 * - Grouped commands: optional grouping support
 * - Shortcuts display: show keyboard shortcuts
 * - Dark mode support
 * - Portal rendering to avoid overflow issues
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <CommandPalette
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   commands={[
 *     { id: '1', label: 'New File', onSelect: () => console.log('New file') },
 *     { id: '2', label: 'Save', shortcut: 'Ctrl+S', onSelect: () => console.log('Save') },
 *   ]}
 * />
 * ```
 */
export default function CommandPalette(props: Readonly<CommandPaletteProps>) {
	const { t } = useTranslation('commandPalette');
	const { isOpen, placeholder, emptyState, className, overlayClassName } = props;
	const defaultPlaceholder = placeholder ?? t('placeholder');
	const defaultEmptyState = emptyState ?? t('emptyState');
	const state = useCommandPaletteState(props);
	return renderCommandPaletteContent({
		isOpen,
		paletteId: useId(),
		state,
		overlayClassName,
		placeholder: defaultPlaceholder,
		emptyState: defaultEmptyState,
		className,
	});
}
