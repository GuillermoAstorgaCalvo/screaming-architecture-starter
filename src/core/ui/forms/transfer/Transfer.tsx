import type { TransferProps } from '@src-types/ui/data/transfer';

import { TransferContent } from './TransferContent';
import { useTransfer } from './useTransfer';

/**
 * Transfer - Component for moving items between two lists
 *
 * Features:
 * - Two-panel interface (source and target lists)
 * - Multiple selection with checkboxes
 * - Search/filter functionality for both lists
 * - Move items between lists with buttons
 * - Select all/none functionality
 * - Custom item renderers
 * - Accessible: proper ARIA attributes and keyboard navigation
 * - Size variants: sm, md, lg
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Transfer
 *   options={[
 *     { value: '1', label: 'Permission 1' },
 *     { value: '2', label: 'Permission 2' },
 *   ]}
 *   value={selectedPermissions}
 *   onChange={setSelectedPermissions}
 *   sourceTitle="Available Permissions"
 *   targetTitle="Assigned Permissions"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Transfer
 *   options={roles}
 *   value={selectedRoles}
 *   onChange={setSelectedRoles}
 *   showSearch
 *   filterFn={(option, search) =>
 *     option.label.toLowerCase().includes(search.toLowerCase())
 *   }
 *   renderItem={(option) => (
 *     <div>
 *       <strong>{option.label}</strong>
 *       <p className="text-sm text-gray-500">{option.description}</p>
 *     </div>
 *   )}
 * />
 * ```
 */
export default function Transfer<T = unknown>(props: Readonly<TransferProps<T>>) {
	const transferData = useTransfer(props);
	return <TransferContent {...transferData} />;
}
