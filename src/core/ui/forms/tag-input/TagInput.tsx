import type { TagInputProps } from '@src-types/ui/forms-inputs';

import { TagInputContent } from './TagInputContent';
import { useTagInputProps } from './useTagInput';

/**
 * TagInput - Component for adding/removing multiple tags
 *
 * Features:
 * - Add tags by pressing Enter or comma
 * - Remove tags by clicking the remove button on each chip
 * - Remove last tag with Backspace when input is empty
 * - Duplicate detection (configurable)
 * - Maximum tags limit
 * - Accessible: proper ARIA attributes and relationships
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Automatic ID generation when label is provided
 * - Controlled and uncontrolled modes
 *
 * @example
 * ```tsx
 * <TagInput
 *   label="Tags"
 *   placeholder="Add tags..."
 *   onChange={(tags) => console.log(tags)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <TagInput
 *   label="Skills"
 *   tags={skills}
 *   onChange={setSkills}
 *   maxTags={5}
 *   chipVariant="primary"
 *   error={errors.skills}
 *   helperText="Add up to 5 skills"
 * />
 * ```
 */
export default function TagInput(props: Readonly<TagInputProps>) {
	const { state, fieldProps, label, error, helperText, required, fullWidth } = useTagInputProps({
		props,
	});
	return (
		<TagInputContent
			state={state}
			fieldProps={fieldProps}
			label={label}
			error={error}
			helperText={helperText}
			required={required}
			fullWidth={fullWidth}
		/>
	);
}
