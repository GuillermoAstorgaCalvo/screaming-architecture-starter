import type { SwitchProps } from '@src-types/ui/forms';

import { SwitchContent } from './SwitchContent';
import { useSwitchProps } from './useSwitch';

/**
 * Switch - Reusable toggle switch component with label, error, and helper text support
 *
 * Features:
 * - Accessible: proper ARIA attributes and relationships
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Automatic ID generation when label is provided
 * - Controlled and uncontrolled modes
 * - Animated toggle transition
 *
 * @example
 * ```tsx
 * <Switch
 *   label="Enable notifications"
 *   checked={notificationsEnabled}
 *   onChange={(e) => setNotificationsEnabled(e.target.checked)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Switch
 *   label="Dark mode"
 *   defaultChecked
 *   size="lg"
 *   helperText="Toggle dark mode on/off"
 * />
 * ```
 */
export default function Switch(props: Readonly<SwitchProps>) {
	const { contentProps } = useSwitchProps({ props });
	return <SwitchContent {...contentProps} />;
}
