import Button from '@core/ui/button/Button';
import Backdrop from '@core/ui/overlays/backdrop/Backdrop';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function BackdropShowcase({
	isOpen,
	onOpen,
	onClose,
}: Readonly<{
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}>) {
	return (
		<ShowcaseSection
			title="Backdrop"
			description="Backdrop component"
			tags={['overlay', 'backdrop', 'overlay']}
		>
			<div className="flex flex-wrap gap-4">
				<Button variant="primary" onClick={onOpen}>
					Show Backdrop
				</Button>
				<Backdrop isOpen={isOpen} onClick={onClose} />
			</div>
		</ShowcaseSection>
	);
}
