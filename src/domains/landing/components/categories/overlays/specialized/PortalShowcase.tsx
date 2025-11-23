import Button from '@core/ui/button/Button';
import Portal from '@core/ui/overlays/portal/Portal';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';
import { useState } from 'react';

export function PortalShowcase() {
	const [isPortaled, setIsPortaled] = useState(false);

	return (
		<ShowcaseSection
			title="Portal"
			description="Portal component for rendering content outside the DOM hierarchy"
			tags={['overlay', 'portal', 'utility']}
		>
			<div className="flex flex-col gap-4">
				<div className="flex flex-wrap gap-4">
					<Button variant="primary" onClick={() => setIsPortaled(!isPortaled)}>
						{isPortaled ? 'Remove Portal' : 'Show Portaled Content'}
					</Button>
				</div>
				<div className="border-2 border-dashed border-muted p-4 rounded">
					<Text className="text-muted-foreground">
						This is the original container. The portaled content will appear outside this container.
					</Text>
				</div>
				{isPortaled ? (
					<Portal>
						<div className="fixed bottom-4 right-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg z-50">
							<Text className="font-semibold">This content is portaled to document.body!</Text>
							<Text className="text-sm mt-2">
								It appears outside the normal DOM hierarchy, typically at the root level.
							</Text>
						</div>
					</Portal>
				) : null}
			</div>
		</ShowcaseSection>
	);
}
