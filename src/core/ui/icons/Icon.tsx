import { getIconVariantClasses } from '@core/ui/variants/icon';
import type { BaseIconProps, StandardSize } from '@src-types/ui/base';
import type { IconProps } from '@src-types/ui/icons';
import { type ReactElement, useMemo } from 'react';

import { getIcon } from './iconRegistry';

interface RenderIconContentOptions {
	IconComponent: ReturnType<typeof getIcon>;
	size: StandardSize;
	className: string | undefined;
	props: Omit<IconProps, 'name' | 'size' | 'fallback' | 'className'>;
}

function renderIconContent(options: RenderIconContentOptions): ReactElement | null {
	const { IconComponent, size, className, props } = options;
	if (!IconComponent) {
		return null;
	}

	const iconProps: BaseIconProps = {
		size,
		className: getIconVariantClasses({ size, className }),
		...props,
	};

	return <IconComponent {...iconProps} />;
}

/**
 * Icon - Generic icon wrapper component that uses the icon registry
 *
 * Features:
 * - Centralized icon registry
 * - Type-safe icon names
 * - Fallback support
 * - Size variants: sm, md, lg
 * - Consistent styling with all icons
 *
 * @example
 * ```tsx
 * <Icon name="search" size="md" />
 * ```
 *
 * @example
 * ```tsx
 * <Icon
 *   name="settings"
 *   size="lg"
 *   fallback={<span>⚙️</span>}
 * />
 * ```
 */
export default function Icon({
	name,
	size = 'md',
	fallback,
	className,
	...props
}: Readonly<IconProps>) {
	const IconComponent = useMemo(() => getIcon(name), [name]);

	if (!IconComponent) {
		if (fallback) {
			return fallback as ReactElement;
		}
		console.warn(`Icon "${name}" not found in registry`);
		return null;
	}

	return renderIconContent({ IconComponent, size, className, props });
}
