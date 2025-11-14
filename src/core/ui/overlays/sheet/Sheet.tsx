import { SheetPortalContent } from '@core/ui/overlays/sheet/components/SheetPortalContent';
import { buildSheetPortalProps } from '@core/ui/overlays/sheet/helpers/SheetHelpers';
import { useSheetId } from '@core/ui/overlays/sheet/hooks/useSheet';
import { useSheetSetup } from '@core/ui/overlays/sheet/hooks/useSheetSetup';
import type { SheetProps } from '@src-types/ui/overlays/panels';
import { createPortal } from 'react-dom';

/** Sheet - Alternative to Drawer for bottom/top/side panels. Features: Accessible, multiple positions, customizable sizes, escape key handling, dark mode */
export default function Sheet(props: Readonly<SheetProps>) {
	const id = useSheetId(props.sheetId);
	const { sheetRef, handleOverlayClick } = useSheetSetup(
		props.isOpen,
		props.closeOnEscape ?? true,
		props.onClose
	);

	if (!props.isOpen) {
		return null;
	}
	return createPortal(
		<SheetPortalContent {...buildSheetPortalProps({ props, id, sheetRef, handleOverlayClick })} />,
		document.body
	);
}
