import { createContext } from 'react';

import type { ToggleGroupContextValue } from './ToggleGroupTypes';

export const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);
