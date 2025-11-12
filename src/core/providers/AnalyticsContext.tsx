import type { AnalyticsPort } from '@core/ports/AnalyticsPort';
import { createContext } from 'react';

export const AnalyticsContext = createContext<AnalyticsPort | undefined>(undefined);

AnalyticsContext.displayName = 'AnalyticsContext';
