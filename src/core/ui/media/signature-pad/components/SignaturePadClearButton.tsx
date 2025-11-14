interface SignaturePadClearButtonProps {
	readonly onClick: () => void;
	readonly label: string;
}

/**
 * Clear button component for signature pad
 */
export function SignaturePadClearButton({
	onClick,
	label,
}: Readonly<SignaturePadClearButtonProps>) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="absolute bottom-2 right-2 rounded bg-muted px-2 py-1 text-sm text-text-secondary hover:bg-muted-dark dark:bg-muted-dark dark:text-text-secondary-dark dark:hover:bg-muted"
			aria-label={label}
		>
			{label}
		</button>
	);
}
