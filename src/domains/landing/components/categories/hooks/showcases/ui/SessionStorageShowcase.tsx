import { useSessionStorage } from '@core/hooks/storage/useSessionStorage';
import Card from '@core/ui/data-display/card/Card';
import Input from '@core/ui/forms/input/Input';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function SessionStorageShowcase() {
	const [sessionValue, setSessionValue] = useSessionStorage('demo-session-key', '');

	return (
		<ShowcaseSection
			title="useSessionStorage"
			description="Persist data in sessionStorage"
			tags={['hook', 'storage', 'sessionStorage', 'persist']}
		>
			<div className="space-y-4">
				<Input
					label="SessionStorage value"
					value={sessionValue}
					onChange={e => setSessionValue(e.target.value)}
				/>
				<Card variant="outlined" padding="sm">
					<Text size="sm">
						<strong>Stored:</strong> {sessionValue || '(empty)'}
					</Text>
					<Text size="sm" className="mt-2 text-muted-foreground">
						This value persists for the session only
					</Text>
				</Card>
			</div>
		</ShowcaseSection>
	);
}
