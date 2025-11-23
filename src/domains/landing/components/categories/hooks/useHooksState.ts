import { useDebounce } from '@core/hooks/debounce/useDebounce';
import { useThrottle } from '@core/hooks/throttle/useThrottle';
import { usePrevious } from '@core/hooks/ui/usePrevious';
import { useState } from 'react';

/**
 * useHooksState - Custom hook for managing shared state across hook showcases
 */
export function useHooksState() {
	const [inputValue, setInputValue] = useState('');
	const DEBOUNCE_DELAY = 500;
	const debouncedValue = useDebounce(inputValue, DEBOUNCE_DELAY);
	const throttledValue = useThrottle(inputValue, 1000);
	const previousValue = usePrevious(inputValue);

	return {
		inputValue,
		setInputValue,
		debouncedValue,
		throttledValue,
		previousValue,
	};
}
