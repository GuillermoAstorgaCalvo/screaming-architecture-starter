import type { ToggleGroupContextValue } from '@core/ui/forms/toggle/types/ToggleGroupTypes';
import { createContext } from 'react';

export const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);
