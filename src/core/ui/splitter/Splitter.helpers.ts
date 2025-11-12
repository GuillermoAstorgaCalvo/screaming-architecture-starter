import type { SplitterOrientation, SplitterPanelConfig } from '@src-types/ui/layout/splitter';
import { Children, type ComponentProps, isValidElement, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { SplitterPanel } from './SplitterPanel';

/**
 * Conditionally include property if value is defined
 */
export function ifDefined<T>(
	value: T | undefined,
	key: keyof SplitterPanelConfig
): Partial<SplitterPanelConfig> {
	return value === undefined ? {} : ({ [key]: value } as Partial<SplitterPanelConfig>);
}

/**
 * Create a panel config from panel props
 */
export function createPanelConfig(
	props: ComponentProps<typeof SplitterPanel>
): SplitterPanelConfig {
	return {
		id: props.id,
		...ifDefined(props['defaultSize'], 'defaultSize'),
		...ifDefined(props['size'], 'size'),
		...ifDefined(props['minSize'], 'minSize'),
		...ifDefined(props['maxSize'], 'maxSize'),
		...ifDefined(props['collapsible'], 'collapsible'),
		...ifDefined(props['defaultCollapsed'], 'defaultCollapsed'),
		...ifDefined(props['collapsed'], 'collapsed'),
		...ifDefined(props['collapsedSize'], 'collapsedSize'),
		...ifDefined(props['onResize'], 'onResize'),
		...ifDefined(props['onCollapseChange'], 'onCollapseChange'),
	};
}

/**
 * Extract panel configurations from children or use provided panels prop
 */
export function extractPanelConfigs(
	children: ReactNode,
	panels?: readonly SplitterPanelConfig[]
): readonly SplitterPanelConfig[] {
	if (panels && panels.length > 0) {
		return panels;
	}

	const configs: SplitterPanelConfig[] = [];

	Children.forEach(children, child => {
		if (isValidElement(child) && child.type === SplitterPanel) {
			const props = child.props as ComponentProps<typeof SplitterPanel>;
			configs.push(createPanelConfig(props));
		}
	});

	return configs;
}

/**
 * Get container classes based on orientation
 */
export function getContainerClasses(orientation: SplitterOrientation, className?: string): string {
	const baseClasses = 'flex w-full h-full';
	const orientationClasses = orientation === 'horizontal' ? 'flex-row' : 'flex-col';
	return twMerge(baseClasses, orientationClasses, className);
}
