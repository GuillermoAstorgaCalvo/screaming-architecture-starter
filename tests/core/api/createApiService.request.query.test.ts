import { createApiService } from '@core/api/createApiService';
import { beforeEach, describe, it } from 'vitest';

import {
	assertRequestUrlContains,
	assertRequestUrlEquals,
	TEST_DATE_STRING,
	UNSERIALIZABLE_PLACEHOLDER,
} from './createApiService.request.test-utils';
import {
	API_ENDPOINT,
	createMockHttpAdapter,
	createMockHttpResponse,
} from './createApiService.test-utils';

function setupTest() {
	const http = createMockHttpAdapter();
	return { http };
}

describe('createApiService - Request Preparation - Primitive Types', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	it('serializes primitive query parameters', async () => {
		const service = createApiService<{ id: string }>(http, {
			endpoint: API_ENDPOINT,
			requestMapper: () => ({
				query: {
					id: '123',
					page: 1,
					active: true,
				},
			}),
		});

		http.mockResponse(
			`${API_ENDPOINT}?id=123&page=1&active=true`,
			'GET',
			createMockHttpResponse({})
		);
		await service.execute({ id: '123' });
		assertRequestUrlContains(http, 'id=123', 'page=1', 'active=true');
	});

	it('serializes Date query parameters as ISO strings', async () => {
		const service = createApiService<{ date: Date }>(http, {
			endpoint: API_ENDPOINT,
			requestMapper: ({ request }) => ({
				query: {
					date: request.date,
				},
			}),
		});

		const testDate = new Date(TEST_DATE_STRING);
		const expectedIso = testDate.toISOString();

		http.mockResponse(
			`${API_ENDPOINT}?date=${encodeURIComponent(expectedIso)}`,
			'GET',
			createMockHttpResponse({})
		);
		await service.execute({ date: testDate });
		assertRequestUrlContains(http, `date=${encodeURIComponent(expectedIso)}`);
	});
});

describe('createApiService - Request Preparation - BigInt', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	it('handles bigint query parameters', async () => {
		const service = createApiService<{ big: bigint }>(http, {
			endpoint: API_ENDPOINT,
			requestMapper: ({ request }) => ({
				query: {
					big: request.big,
				},
			}),
		});

		const testBigInt = BigInt('9007199254740991');

		http.mockResponse(
			`${API_ENDPOINT}?big=${encodeURIComponent('9007199254740991')}`,
			'GET',
			createMockHttpResponse({})
		);
		await service.execute({ big: testBigInt });
		assertRequestUrlContains(http, 'big=9007199254740991');
	});
});

describe('createApiService - Request Preparation - Collection Types', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	describe('Query Parameter Serialization - Collection Types', () => {
		it('serializes array query parameters', async () => {
			const service = createApiService<{ ids: string[] }>(http, {
				endpoint: API_ENDPOINT,
				requestMapper: ({ request }) => ({
					query: {
						ids: request.ids,
					},
				}),
			});

			http.mockResponse(`${API_ENDPOINT}?ids=1&ids=2&ids=3`, 'GET', createMockHttpResponse({}));
			await service.execute({ ids: ['1', '2', '3'] });
			assertRequestUrlContains(http, 'ids=1', 'ids=2', 'ids=3');
		});

		it('serializes object query parameters as JSON strings', async () => {
			const service = createApiService<{ filter: Record<string, unknown> }>(http, {
				endpoint: API_ENDPOINT,
				requestMapper: ({ request }) => ({
					query: {
						filter: request.filter,
					},
				}),
			});

			const filterObject = { status: 'active', role: 'admin' };
			const expectedJson = JSON.stringify(filterObject);

			http.mockResponse(
				`${API_ENDPOINT}?filter=${encodeURIComponent(expectedJson)}`,
				'GET',
				createMockHttpResponse({})
			);
			await service.execute({ filter: filterObject });
			assertRequestUrlContains(http, `filter=${encodeURIComponent(expectedJson)}`);
		});

		it('handles nested object query parameters', async () => {
			const service = createApiService<{ options: { nested: { value: string } } }>(http, {
				endpoint: API_ENDPOINT,
				requestMapper: ({ request }) => ({
					query: {
						options: request.options,
					},
				}),
			});

			const nestedObject = { nested: { value: 'test' } };
			const expectedJson = JSON.stringify(nestedObject);

			http.mockResponse(
				`${API_ENDPOINT}?options=${encodeURIComponent(expectedJson)}`,
				'GET',
				createMockHttpResponse({})
			);
			await service.execute({ options: nestedObject });
			assertRequestUrlContains(http, `options=${encodeURIComponent(expectedJson)}`);
		});
	});
});

describe('createApiService - Request Preparation - Special Types', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	describe('Symbol and Function', () => {
		it('handles symbol query parameters', async () => {
			const service = createApiService<{ sym: symbol }>(http, {
				endpoint: API_ENDPOINT,
				requestMapper: ({ request }) => ({
					query: {
						sym: request.sym,
					},
				}),
			});

			const testSymbol = Symbol('test');
			// URLSearchParams encodes parentheses as %28 and %29
			const params = new URLSearchParams();
			params.append('sym', testSymbol.toString());
			const fullQuery = params.toString();

			http.mockResponse(`${API_ENDPOINT}?${fullQuery}`, 'GET', createMockHttpResponse({}));
			await service.execute({ sym: testSymbol });
			// Check for the encoded version in the URL (Symbol%28test%29)
			assertRequestUrlContains(http, 'sym=Symbol%28test%29');
		});

		it('handles function query parameters', async () => {
			const service = createApiService<{ fn: () => void }>(http, {
				endpoint: API_ENDPOINT,
				requestMapper: ({ request }) => ({
					query: {
						fn: request.fn,
					},
				}),
			});

			const testFunction = () => {
				// test function
			};

			http.mockResponse(
				`${API_ENDPOINT}?fn=${encodeURIComponent('[Function]')}`,
				'GET',
				createMockHttpResponse({})
			);
			await service.execute({ fn: testFunction });
			assertRequestUrlContains(http, 'fn=%5BFunction%5D');
		});
	});
});

describe('createApiService - Request Preparation - Null and Undefined', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	describe('Null and Undefined', () => {
		it('handles null query parameters', async () => {
			const service = createApiService<{ value: null }>(http, {
				endpoint: API_ENDPOINT,
				requestMapper: ({ request }) => ({
					query: {
						value: request.value,
					},
				}),
			});

			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));
			await service.execute({ value: null });
			// null values should be skipped
			assertRequestUrlEquals(http, API_ENDPOINT);
		});

		it('handles undefined query parameters', async () => {
			const service = createApiService<{ value?: string }>(http, {
				endpoint: API_ENDPOINT,
				requestMapper: ({ request }) => ({
					query: {
						value: request.value,
					},
				}),
			});

			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));
			await service.execute({});
			// undefined values should be skipped
			assertRequestUrlEquals(http, API_ENDPOINT);
		});
	});
});

describe('createApiService - Request Preparation - Error Scenarios', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	describe('Query Parameter Serialization - Error Handling', () => {
		it('handles objects with circular references by returning placeholder', async () => {
			const service = createApiService<{ circular: Record<string, unknown> }>(http, {
				endpoint: API_ENDPOINT,
				requestMapper: ({ request }) => ({
					query: {
						circular: request.circular,
					},
				}),
			});

			// Create a circular reference
			const circularObject: Record<string, unknown> = { name: 'test' };
			circularObject.self = circularObject;

			http.mockResponse(
				`${API_ENDPOINT}?circular=${encodeURIComponent(UNSERIALIZABLE_PLACEHOLDER)}`,
				'GET',
				createMockHttpResponse({})
			);
			await service.execute({ circular: circularObject });
			assertRequestUrlContains(http, 'circular=%5BUnserializable%5D');
		});
	});
});

describe('createApiService - Request Preparation - Complex Scenarios', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	describe('Query Parameter Serialization - Complex Scenarios', () => {
		it('handles mixed query parameter types', async () => {
			const service = createApiService<{ mixed: Record<string, unknown> }>(http, {
				endpoint: API_ENDPOINT,
				requestMapper: ({ request }) => ({
					query: {
						string: 'test',
						number: 42,
						boolean: true,
						date: new Date(TEST_DATE_STRING),
						object: request.mixed,
						array: [1, 2, 3],
					},
				}),
			});

			const mixedObject = { key: 'value' };
			const dateIso = new Date(TEST_DATE_STRING).toISOString();
			const objectJson = JSON.stringify(mixedObject);

			http.mockResponse(
				`${API_ENDPOINT}?string=test&number=42&boolean=true&date=${encodeURIComponent(dateIso)}&object=${encodeURIComponent(objectJson)}&array=1&array=2&array=3`,
				'GET',
				createMockHttpResponse({})
			);
			await service.execute({ mixed: mixedObject });
			assertRequestUrlContains(
				http,
				'string=test',
				'number=42',
				'boolean=true',
				`date=${encodeURIComponent(dateIso)}`,
				`object=${encodeURIComponent(objectJson)}`,
				'array=1',
				'array=2',
				'array=3'
			);
		});
	});
});

describe('createApiService - Request Preparation - Edge Cases', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	describe('Empty and URL Handling', () => {
		it('handles empty query object', async () => {
			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
				requestMapper: () => ({
					query: {},
				}),
			});

			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));
			await service.execute({});
			assertRequestUrlEquals(http, API_ENDPOINT);
		});

		it('handles query parameters with existing query string in URL', async () => {
			const service = createApiService(http, {
				endpoint: `${API_ENDPOINT}?existing=value`,
				requestMapper: () => ({
					query: {
						additional: 'param',
					},
				}),
			});

			http.mockResponse(
				`${API_ENDPOINT}?existing=value&additional=param`,
				'GET',
				createMockHttpResponse({})
			);
			await service.execute({});
			assertRequestUrlContains(http, 'existing=value', 'additional=param');
		});
	});
});

describe('createApiService - Request Preparation - Array Edge Cases', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	describe('Array Edge Cases', () => {
		it('handles array with mixed types', async () => {
			const service = createApiService<{ items: unknown[] }>(http, {
				endpoint: API_ENDPOINT,
				requestMapper: ({ request }) => ({
					query: {
						items: request.items,
					},
				}),
			});

			const mixedArray = ['string', 123, true, new Date(TEST_DATE_STRING)];
			const dateIso = new Date(TEST_DATE_STRING).toISOString();

			http.mockResponse(
				`${API_ENDPOINT}?items=string&items=123&items=true&items=${encodeURIComponent(dateIso)}`,
				'GET',
				createMockHttpResponse({})
			);
			await service.execute({ items: mixedArray });
			assertRequestUrlContains(
				http,
				'items=string',
				'items=123',
				'items=true',
				`items=${encodeURIComponent(dateIso)}`
			);
		});

		it('handles array with objects', async () => {
			const service = createApiService<{ filters: Record<string, unknown>[] }>(http, {
				endpoint: API_ENDPOINT,
				requestMapper: ({ request }) => ({
					query: {
						filters: request.filters,
					},
				}),
			});

			const filters = [{ status: 'active' }, { role: 'admin' }];
			const filter1Json = JSON.stringify(filters[0]);
			const filter2Json = JSON.stringify(filters[1]);

			http.mockResponse(
				`${API_ENDPOINT}?filters=${encodeURIComponent(filter1Json)}&filters=${encodeURIComponent(filter2Json)}`,
				'GET',
				createMockHttpResponse({})
			);
			await service.execute({ filters });
			assertRequestUrlContains(
				http,
				`filters=${encodeURIComponent(filter1Json)}`,
				`filters=${encodeURIComponent(filter2Json)}`
			);
		});
	});
});

describe('createApiService - Request Preparation - Serialization Errors', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	describe('Error Scenarios', () => {
		it('handles objects that throw during JSON.stringify', async () => {
			const service = createApiService<{ problematic: Record<string, unknown> }>(http, {
				endpoint: API_ENDPOINT,
				requestMapper: ({ request }) => ({
					query: {
						problematic: request.problematic,
					},
				}),
			});

			// Create an object that will cause JSON.stringify to throw
			// Using a getter that throws
			const problematicObject = {};
			Object.defineProperty(problematicObject, 'value', {
				get() {
					throw new Error('Cannot serialize');
				},
				enumerable: true,
			});

			http.mockResponse(
				`${API_ENDPOINT}?problematic=${encodeURIComponent(UNSERIALIZABLE_PLACEHOLDER)}`,
				'GET',
				createMockHttpResponse({})
			);
			await service.execute({ problematic: problematicObject });
			assertRequestUrlContains(http, 'problematic=%5BUnserializable%5D');
		});
	});
});
