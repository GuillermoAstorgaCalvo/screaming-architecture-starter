import type { StandardSize } from '@src-types/ui/base';
import type { FormActionsAlignment } from '@src-types/ui/forms';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * FormActions gap classes
 */
const FORM_ACTIONS_GAP_CLASSES: Record<StandardSize | 'none', string> = {
	none: '',
	sm: 'gap-2',
	md: 'gap-4',
	lg: 'gap-6',
} as const;

/**
 * FormActions alignment classes
 */
const FORM_ACTIONS_ALIGN_CLASSES: Record<FormActionsAlignment, string> = {
	start: 'justify-start',
	center: 'justify-center',
	end: 'justify-end',
	'space-between': 'justify-between',
} as const;

/**
 * FormActions variant definition using class-variance-authority
 *
 * Provides type-safe variant management for FormActions component.
 */
export const formActionsVariants = cva('flex flex-row', {
	variants: {
		gap: {
			none: FORM_ACTIONS_GAP_CLASSES.none,
			sm: FORM_ACTIONS_GAP_CLASSES.sm,
			md: FORM_ACTIONS_GAP_CLASSES.md,
			lg: FORM_ACTIONS_GAP_CLASSES.lg,
		},
		align: {
			start: FORM_ACTIONS_ALIGN_CLASSES.start,
			center: FORM_ACTIONS_ALIGN_CLASSES.center,
			end: FORM_ACTIONS_ALIGN_CLASSES.end,
			'space-between': FORM_ACTIONS_ALIGN_CLASSES['space-between'],
		},
		fullWidth: {
			true: 'w-full',
			false: '',
		},
	},
	defaultVariants: {
		gap: 'md',
		align: 'end',
		fullWidth: false,
	},
});

/**
 * Type for form actions variant props
 * Extracted from formActionsVariants using VariantProps
 */
export type FormActionsVariants = VariantProps<typeof formActionsVariants>;

/**
 * Helper function to get form actions class names with proper merging
 *
 * @param props - FormActions variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getFormActionsVariantClasses(
	props: FormActionsVariants & { className?: string | undefined }
): string {
	return twMerge(formActionsVariants(props), props.className);
}
