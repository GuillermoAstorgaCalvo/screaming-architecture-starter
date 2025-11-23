import { useLocalStorage } from '@core/hooks/storage/useLocalStorage';
import Card from '@core/ui/data-display/card/Card';
import Input from '@core/ui/forms/input/Input';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function LocalStorageShowcase() {
	const [storedValue, setStoredValue] = useLocalStorage('demo-key', '');

	return (
		<ShowcaseSection
			title="useLocalStorage"
			description="Persist data in localStorage"
			tags={['hook', 'storage', 'localStorage', 'persist']}
		>
			<div className="space-y-4">
				<Input
					label="LocalStorage value"
					value={storedValue}
					onChange={e => setStoredValue(e.target.value)}
				/>
				<Card variant="outlined" padding="sm">
					<Text size="sm">
						<strong>Stored:</strong> {storedValue || '(empty)'}
					</Text>
					<Text size="sm" className="mt-2 text-muted-foreground">
						This value persists across page reloads
					</Text>
				</Card>
			</div>
		</ShowcaseSection>
	);
}
