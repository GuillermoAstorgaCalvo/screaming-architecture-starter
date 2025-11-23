import Heading from '@core/ui/heading/Heading';
import Text from '@core/ui/text/Text';

/**
 * HooksHeader - Header component for Hooks category
 */
export function HooksHeader() {
	return (
		<div>
			<Heading as="h1" size="lg" className="mb-2 text-white">
				Hooks
			</Heading>
			<Text className="text-white/70">
				Custom React hooks for common functionality and state management
			</Text>
		</div>
	);
}
