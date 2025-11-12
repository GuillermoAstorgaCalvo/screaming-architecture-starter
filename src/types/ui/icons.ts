import type { ComponentType, ReactNode } from 'react';

import type { BaseIconProps } from './base';

/**
 * Icon name type (string literal for icon registry)
 */
export type IconName = string;

/**
 * Icon component props
 */
export interface IconProps extends Omit<BaseIconProps, 'size'> {
	/** Name of the icon to render from registry */
	name: IconName;
	/** Size of the icon @default 'md' */
	size?: BaseIconProps['size'];
	/** Fallback content if icon not found */
	fallback?: ReactNode;
}

/**
 * Icon registry type
 */
export type IconRegistry = Record<IconName, ComponentType<BaseIconProps>>;
