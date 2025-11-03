/**
 * API response factories
 * Build test data for API responses used in components and tests
 */

/**
 * Example API response structure from ApiDemoSection
 */
export interface ApiResponse {
	slideshow: {
		author: string;
		date: string;
		slides: Array<{
			title: string;
			type: string;
			items?: string[];
		}>;
		title: string;
	};
}

/**
 * Partial type for building ApiResponse with overrides
 */
export interface ApiResponseOverrides {
	slideshow?: Partial<ApiResponse['slideshow']> & {
		slides?: Partial<ApiResponse['slideshow']['slides'][0]>[];
	};
}

/**
 * Build an ApiResponse with sensible defaults
 *
 * @param overrides - Optional fields to override
 * @returns Complete ApiResponse object
 *
 * @example
 * ```ts
 * // Default response
 * const response = buildApiResponse();
 *
 * // Custom title
 * const response = buildApiResponse({
 *   slideshow: { title: 'My Custom Slideshow' }
 * });
 *
 * // Custom slides
 * const response = buildApiResponse({
 *   slideshow: {
 *     slides: [
 *       { title: 'Slide 1', type: 'intro' },
 *       { title: 'Slide 2', type: 'content' }
 *     ]
 *   }
 * });
 * ```
 */
export function buildApiResponse(overrides: ApiResponseOverrides = {}): ApiResponse {
	const defaultSlideshow: ApiResponse['slideshow'] = {
		author: 'John Doe',
		date: '2024-01-01',
		slides: [
			{
				title: 'Welcome',
				type: 'intro',
				items: ['Item 1', 'Item 2'],
			},
			{
				title: 'Overview',
				type: 'content',
			},
		],
		title: 'Test Slideshow',
	};

	const slideshowOverrides = overrides.slideshow ?? {};

	const customSlides =
		slideshowOverrides.slides === undefined
			? defaultSlideshow.slides
			: slideshowOverrides.slides.map((slide, index) => {
					const defaultSlide = defaultSlideshow.slides[index];
					return defaultSlide ? { ...defaultSlide, ...slide } : slide;
				});

	return {
		slideshow: {
			...defaultSlideshow,
			...slideshowOverrides,
			slides: customSlides,
		},
	};
}

/**
 * Build a paginated API response
 *
 * @param data - Array of data items
 * @param page - Current page number (default: 1, must be >= 1)
 * @param pageSize - Items per page (default: 10, must be >= 1)
 * @param total - Total number of items (default: data.length)
 * @returns Paginated response structure
 *
 * @example
 * ```ts
 * const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 * const response = buildPaginatedResponse(items, 2, 3);
 * // Returns: { data: [4, 5, 6], pagination: { page: 2, pageSize: 3, total: 10, totalPages: 4 } }
 * ```
 */
export function buildPaginatedResponse<T>(
	data: T[],
	page = 1,
	pageSize = 10,
	total?: number
): {
	data: T[];
	pagination: {
		page: number;
		pageSize: number;
		total: number;
		totalPages: number;
	};
} {
	const safePage = Math.max(1, Math.floor(page));
	const safePageSize = Math.max(1, Math.floor(pageSize));
	const totalItems = total ?? data.length;
	const safeTotal = Math.max(0, totalItems);
	const totalPages = safeTotal > 0 ? Math.ceil(safeTotal / safePageSize) : 0;
	const startIndex = (safePage - 1) * safePageSize;

	return {
		data: data.slice(startIndex, startIndex + safePageSize),
		pagination: {
			page: safePage,
			pageSize: safePageSize,
			total: safeTotal,
			totalPages,
		},
	};
}

/**
 * Build an HTTP error response
 *
 * @param status - HTTP status code (default: 500)
 * @param message - Error message (default: 'Internal Server Error')
 * @param details - Additional error details
 * @returns Error response structure
 */
export function buildErrorResponse(
	status = 500,
	message = 'Internal Server Error',
	details?: Record<string, unknown>
): {
	status: number;
	error: {
		message: string;
		code?: string;
		details?: Record<string, unknown>;
	};
} {
	return {
		status,
		error: {
			message,
			...(details && { details }),
		},
	};
}
