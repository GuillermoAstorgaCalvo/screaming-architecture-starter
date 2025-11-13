import { twMerge } from 'tailwind-merge';

type AccordionIconProps = Readonly<{
	isExpanded: boolean;
}>;

export function AccordionIcon({ isExpanded }: AccordionIconProps) {
	return (
		<svg
			className={twMerge('h-5 w-5 transition-transform', isExpanded && 'rotate-180')}
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			aria-hidden="true"
		>
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
		</svg>
	);
}
