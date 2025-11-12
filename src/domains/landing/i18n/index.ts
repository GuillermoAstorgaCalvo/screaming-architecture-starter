/**
 * Landing domain translations registration
 *
 * This file registers the landing domain translations with the i18n system.
 * It follows the scalable pattern where domains register their own translations.
 */

import { registerDomainTranslations } from '@core/i18n/registry';

// Register landing domain translations
// Registration is synchronous, so it completes immediately when this module is imported
registerDomainTranslations('landing', async language => {
	switch (language) {
		case 'en': {
			return import('./en.json');
		}
		case 'es': {
			return import('./es.json');
		}
		case 'ar': {
			return import('./ar.json');
		}
		default: {
			return import('./en.json');
		}
	}
});
