import {
	AVATAR_BASE_CLASSES,
	AVATAR_SIZE_CLASSES,
	AVATAR_VARIANT_CLASSES,
} from '@core/constants/ui/data';
import type { AvatarProps } from '@src-types/ui/feedback';
import { type ReactNode, useState } from 'react';
import { twMerge } from 'tailwind-merge';

function getAvatarClasses(size: string, variant: string, className?: string): string {
	const sizeClasses = AVATAR_SIZE_CLASSES[size as keyof typeof AVATAR_SIZE_CLASSES];
	const variantClasses = AVATAR_VARIANT_CLASSES[variant as keyof typeof AVATAR_VARIANT_CLASSES];
	return twMerge(AVATAR_BASE_CLASSES, sizeClasses, variantClasses, className);
}

/**
 * Avatar - User profile image component
 *
 * Features:
 * - Multiple sizes: xs, sm, md, lg, xl, 2xl
 * - Multiple variants: circle, square, rounded
 * - Image with fallback support
 * - Icon support
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Avatar
 *   src="/user.jpg"
 *   alt="User name"
 *   fallback="JD"
 *   size="md"
 *   variant="circle"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Avatar
 *   icon={<UserIcon />}
 *   size="lg"
 *   variant="rounded"
 * />
 * ```
 */
function AvatarImage({
	src,
	alt,
	onError,
}: Readonly<{
	src: string;
	alt?: string | undefined;
	onError: () => void;
}>) {
	return <img src={src} alt={alt} onError={onError} className="h-full w-full object-cover" />;
}

function AvatarContent({
	showImage,
	src,
	alt,
	icon,
	fallback,
	onImageError,
}: Readonly<{
	showImage: boolean;
	src?: string | undefined;
	alt?: string | undefined;
	icon?: ReactNode;
	fallback?: string | undefined;
	onImageError: () => void;
}>) {
	if (showImage && src) {
		return <AvatarImage src={src} alt={alt} onError={onImageError} />;
	}
	if (icon) {
		return <span className="flex items-center justify-center">{icon}</span>;
	}
	return <span>{fallback ?? '?'}</span>;
}

export default function Avatar({
	src,
	alt,
	fallback,
	size = 'md',
	variant = 'circle',
	icon,
	className,
	...props
}: Readonly<AvatarProps>) {
	const [imageError, setImageError] = useState(false);
	const showImage = Boolean(src && !imageError);

	return (
		<div className={getAvatarClasses(size, variant, className)} {...props}>
			<AvatarContent
				showImage={showImage}
				src={src}
				alt={alt}
				icon={icon}
				fallback={fallback}
				onImageError={() => setImageError(true)}
			/>
		</div>
	);
}
