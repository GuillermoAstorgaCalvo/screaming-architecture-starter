import { ComponentFilterContext } from '@domains/landing/context/componentFilterContext.constants';
import { useContext } from 'react';

export function useComponentFilterContext() {
	const context = useContext(ComponentFilterContext);
	if (context === undefined) {
		throw new Error('useComponentFilterContext must be used within ComponentFilterProvider');
	}
	return context;
}
