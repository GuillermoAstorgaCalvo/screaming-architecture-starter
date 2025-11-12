import type { ReactNode } from 'react';

export type ToggleGroupType = 'single' | 'multiple';

export interface ToggleGroupProps {
	/** Type of selection: single or multiple @default 'single' */
	type?: ToggleGroupType;
	/** Selected value(s) - controlled mode */
	value?: string | string[];
	/** Callback when value changes */
	onValueChange?: (value: string | string[]) => void;
	/** Variant for all toggles in the group @default 'default' */
	variant?: 'default' | 'outline';
	/** Size for all toggles in the group @default 'md' */
	size?: 'sm' | 'md' | 'lg';
	/** Whether all toggles are disabled @default false */
	disabled?: boolean;
	/** Additional className */
	className?: string;
	/** Toggle children */
	children: ReactNode;
}

export interface ToggleGroupContextValue {
	readonly type: ToggleGroupType;
	readonly selectedValues: string[];
	readonly handleToggle: (value: string) => void;
	readonly variant: 'default' | 'outline';
	readonly size: 'sm' | 'md' | 'lg';
	readonly groupDisabled: boolean;
}
