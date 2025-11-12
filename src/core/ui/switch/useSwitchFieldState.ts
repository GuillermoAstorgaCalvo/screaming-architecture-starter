import { useEffect, useRef } from 'react';

import type { SwitchFieldStateConfig } from './SwitchTypes';

export function useSwitchFieldState(config: Readonly<SwitchFieldStateConfig>) {
	const { checked, defaultChecked, disabled } = config;
	const inputRef = useRef<HTMLInputElement>(null);
	const lockedCheckedRef = useRef<boolean>(checked ?? defaultChecked ?? false);

	// Update locked value when checked or defaultChecked changes
	useEffect(() => {
		if (disabled) {
			if (checked !== undefined) {
				lockedCheckedRef.current = checked;
			} else if (defaultChecked !== undefined) {
				lockedCheckedRef.current = defaultChecked;
			}
		}
	}, [disabled, checked, defaultChecked]);

	const getLockedChecked = () => lockedCheckedRef.current;

	return { inputRef, getLockedChecked };
}
