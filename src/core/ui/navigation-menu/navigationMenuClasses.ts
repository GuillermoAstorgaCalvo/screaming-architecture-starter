import { classNames } from '@core/utils/classNames';
import type { NavigationMenuVariant } from '@src-types/ui/navigation';

interface GetNavigationMenuClassesParams {
	readonly variant: NavigationMenuVariant;
	readonly orientation: 'horizontal' | 'vertical';
	readonly className?: string | undefined;
}

export function getNavigationMenuClasses({
	variant,
	orientation,
	className,
}: GetNavigationMenuClassesParams): string {
	const baseClasses = 'w-full';
	const orientationClasses = orientation === 'vertical' ? 'flex-col' : 'flex-row';
	const variantClasses = {
		default: '',
		underline: orientation === 'horizontal' ? 'border-b border-border' : 'border-l border-border',
		pills: 'bg-muted rounded-lg p-1',
	};

	return classNames(baseClasses, orientationClasses, variantClasses[variant], className);
}

interface GetNavigationMenuItemClassesParams {
	readonly isActive: boolean;
	readonly size: 'sm' | 'md' | 'lg';
	readonly variant: NavigationMenuVariant;
	readonly orientation: 'horizontal' | 'vertical';
}

function getVariantClasses(
	variant: NavigationMenuVariant,
	orientation: 'horizontal' | 'vertical'
): { active: string; inactive: string } {
	const inactiveClasses = 'text-text-secondary hover:text-text-primary';

	const variantClasses: Record<NavigationMenuVariant, { active: string; inactive: string }> = {
		default: {
			active: 'text-primary',
			inactive: inactiveClasses,
		},
		underline: {
			active:
				orientation === 'horizontal'
					? 'text-primary border-b-2 border-primary -mb-px'
					: 'text-primary border-l-2 border-primary -ml-px',
			inactive: inactiveClasses,
		},
		pills: {
			active: 'bg-surface text-primary shadow-sm',
			inactive: inactiveClasses,
		},
	};

	return variantClasses[variant];
}

export function getNavigationMenuItemClasses({
	isActive,
	size,
	variant,
	orientation,
}: GetNavigationMenuItemClassesParams): string {
	const baseClasses =
		'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

	const sizeClasses = {
		sm: orientation === 'horizontal' ? 'px-2 py-1 text-sm' : 'px-3 py-2 text-sm',
		md: orientation === 'horizontal' ? 'px-3 py-1.5 text-base' : 'px-4 py-2.5 text-base',
		lg: orientation === 'horizontal' ? 'px-4 py-2 text-lg' : 'px-5 py-3 text-lg',
	};

	const variantClasses = getVariantClasses(variant, orientation);

	return classNames(
		baseClasses,
		sizeClasses[size],
		isActive ? variantClasses.active : variantClasses.inactive
	);
}
