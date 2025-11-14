import { DrawerPortalContent } from '@core/ui/overlays/drawer/components/DrawerPortalContent';
import { useDrawerId } from '@core/ui/overlays/drawer/hooks/useDrawer';
import { useDrawerSetup } from '@core/ui/overlays/drawer/hooks/useDrawerSetup';
import { buildDrawerPortalProps } from '@core/ui/overlays/drawer/utils/drawerUtils';
import type { DrawerProps } from '@src-types/ui/overlays/panels';
import { createPortal } from 'react-dom';

/**
 * Drawer - Side panel/drawer component
 *
 * Features:
 * - Accessible: proper ARIA attributes, focus management, keyboard navigation
 * - Multiple positions: left, right, top, bottom
 * - Customizable sizes: sm, md, lg, xl, full
 * - Escape key handling
 * - Overlay click handling
 * - Dark mode support
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <Drawer
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Drawer Title"
 *   position="right"
 *   size="md"
 * >
 *   <p>Drawer content goes here</p>
 * </Drawer>
 * ```
 */
export default function Drawer(props: Readonly<DrawerProps>) {
	const id = useDrawerId(props.drawerId);
	const { drawerRef, handleOverlayClick } = useDrawerSetup(
		props.isOpen,
		props.closeOnEscape ?? true,
		props.onClose
	);

	if (!props.isOpen) {
		return null;
	}

	return createPortal(
		<DrawerPortalContent
			{...buildDrawerPortalProps({ props, id, drawerRef, handleOverlayClick })}
		/>,
		document.body
	);
}
