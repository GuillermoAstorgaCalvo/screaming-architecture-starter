import { useLocalStorage } from '@core/hooks/useLocalStorage';
import Button from '@core/ui/button/Button';
import { useEffect, useState } from 'react';

interface LocalStorageInputProps {
	readonly value: string;
	readonly onChange: (value: string) => void;
	readonly onSave: () => void;
	readonly onRemove: () => void;
}

function LocalStorageInput({ value, onChange, onSave, onRemove }: LocalStorageInputProps) {
	return (
		<div className="space-y-2">
			<input
				type="text"
				value={value}
				onChange={e => onChange(e.target.value)}
				placeholder="Enter a value"
				className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
			/>
			<div className="flex gap-2 flex-wrap">
				<Button onClick={onSave} size="sm">
					Save to Storage
				</Button>
				<Button onClick={onRemove} variant="secondary" size="sm">
					Remove from Storage
				</Button>
			</div>
		</div>
	);
}

export function UseLocalStorageDemo() {
	const [storedValue, setStoredValue, removeValue] = useLocalStorage<string>(
		'hooks-demo-value',
		'Default Value'
	);
	const [inputValue, setInputValue] = useState(storedValue);

	useEffect(() => {
		setInputValue(storedValue);
	}, [storedValue]);

	return (
		<div className="space-y-3">
			<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">useLocalStorage</h3>
			<p className="text-sm text-gray-600 dark:text-gray-400">
				Persist values to localStorage with automatic sync across tabs.
			</p>
			<LocalStorageInput
				value={inputValue}
				onChange={setInputValue}
				onSave={() => setStoredValue(inputValue)}
				onRemove={() => {
					removeValue();
					setInputValue('Default Value');
				}}
			/>
			<div className="text-sm">
				<p>
					Stored value: <span className="font-mono">{storedValue}</span>
				</p>
				<p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
					Try opening this page in another tab and changing the value
				</p>
			</div>
			<p className="text-xs text-gray-500 dark:text-gray-500">
				<code>useLocalStorage</code> from <code>@core/hooks/useLocalStorage</code>
			</p>
		</div>
	);
}
