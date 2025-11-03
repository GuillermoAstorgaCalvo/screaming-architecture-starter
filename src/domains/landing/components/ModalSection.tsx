import Button from '@core/ui/button/Button';
import { useState } from 'react';

import { ModalInstances } from './ModalSection/ModalSectionModals';

function SizesButtons({
	setStates,
}: Readonly<{
	setStates: {
		setSmallModalOpen: (_open: boolean) => void;
		setMediumModalOpen: (_open: boolean) => void;
		setLargeModalOpen: (_open: boolean) => void;
		setXlModalOpen: (_open: boolean) => void;
		setFullModalOpen: (_open: boolean) => void;
	};
}>) {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Sizes</h3>
			<div className="flex flex-wrap gap-3">
				<Button onClick={() => setStates.setSmallModalOpen(true)}>Open Small Modal</Button>
				<Button onClick={() => setStates.setMediumModalOpen(true)}>Open Medium Modal</Button>
				<Button onClick={() => setStates.setLargeModalOpen(true)}>Open Large Modal</Button>
				<Button onClick={() => setStates.setXlModalOpen(true)}>Open XL Modal</Button>
				<Button onClick={() => setStates.setFullModalOpen(true)}>Open Full Modal</Button>
			</div>
		</div>
	);
}

function VariantButtons({
	setModalWithFooterOpen,
	setModalWithoutCloseOpen,
}: Readonly<{
	setModalWithFooterOpen: (_open: boolean) => void;
	setModalWithoutCloseOpen: (_open: boolean) => void;
}>) {
	return (
		<>
			<div>
				<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
					Modal with Footer
				</h3>
				<Button onClick={() => setModalWithFooterOpen(true)}>Open Modal with Footer</Button>
			</div>
			<div>
				<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
					Modal without Close Button
				</h3>
				<Button onClick={() => setModalWithoutCloseOpen(true)}>
					Open Modal without Close Button
				</Button>
			</div>
		</>
	);
}

function useModalStates() {
	const [smallModalOpen, setSmallModalOpen] = useState(false);
	const [mediumModalOpen, setMediumModalOpen] = useState(false);
	const [largeModalOpen, setLargeModalOpen] = useState(false);
	const [xlModalOpen, setXlModalOpen] = useState(false);
	const [fullModalOpen, setFullModalOpen] = useState(false);
	const [modalWithFooterOpen, setModalWithFooterOpen] = useState(false);
	const [modalWithoutCloseOpen, setModalWithoutCloseOpen] = useState(false);

	return {
		smallModalOpen,
		setSmallModalOpen,
		mediumModalOpen,
		setMediumModalOpen,
		largeModalOpen,
		setLargeModalOpen,
		xlModalOpen,
		setXlModalOpen,
		fullModalOpen,
		setFullModalOpen,
		modalWithFooterOpen,
		setModalWithFooterOpen,
		modalWithoutCloseOpen,
		setModalWithoutCloseOpen,
	};
}

export default function ModalSection() {
	const states = useModalStates();

	return (
		<section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
			<h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Modals</h2>
			<div className="space-y-6">
				<SizesButtons
					setStates={{
						setSmallModalOpen: states.setSmallModalOpen,
						setMediumModalOpen: states.setMediumModalOpen,
						setLargeModalOpen: states.setLargeModalOpen,
						setXlModalOpen: states.setXlModalOpen,
						setFullModalOpen: states.setFullModalOpen,
					}}
				/>
				<VariantButtons
					setModalWithFooterOpen={states.setModalWithFooterOpen}
					setModalWithoutCloseOpen={states.setModalWithoutCloseOpen}
				/>
				<ModalInstances {...states} />
			</div>
		</section>
	);
}
