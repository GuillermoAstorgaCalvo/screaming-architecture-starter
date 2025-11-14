import { useTranslation } from '@core/i18n/useTranslation';
import {
	prepareContentParams,
	prepareRenderParams,
} from '@core/ui/overlays/dropdown-menu/helpers/DropdownMenu.helpers';
import { renderDropdownMenu } from '@core/ui/overlays/dropdown-menu/helpers/DropdownMenu.renderers';
import { usePrepareDropdownMenuContent } from '@core/ui/overlays/dropdown-menu/hooks/DropdownMenu.hooks';
import { useDropdownMenu } from '@core/ui/overlays/dropdown-menu/hooks/useDropdownMenu';
import type { DropdownMenuProps } from '@core/ui/overlays/dropdown-menu/types/DropdownMenu.types';

export default function DropdownMenu({
	trigger,
	items,
	isOpen,
	onOpenChange,
	onSelect,
	align = 'center',
	className,
	menuLabel,
	maxHeight = 280,
	emptyState,
}: Readonly<DropdownMenuProps>) {
	const { t } = useTranslation('common');
	const defaultEmptyState = emptyState ?? t('noActionsAvailable');
	const menuData = useDropdownMenu({ items, isOpen, onOpenChange, onSelect });
	const { triggerNode, menuContent } = usePrepareDropdownMenuContent(
		prepareContentParams({ menuData, trigger, items, emptyState: defaultEmptyState })
	);
	return renderDropdownMenu(
		prepareRenderParams({
			menuData,
			triggerNode,
			menuContent,
			align,
			className,
			menuLabel,
			maxHeight,
		})
	);
}
