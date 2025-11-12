/**
 * Domain-specific types
 *
 * This file contains shared/common domain types that are used across
 * multiple domains. Domain-specific types should be defined within their
 * respective domains.
 *
 * Domain types that are only used within a single domain should remain
 * co-located with that domain's code.
 */

/**
 * Base domain entity interface
 * All domain entities should extend this interface
 */
export interface BaseDomainEntity {
	/** Unique identifier */
	id: string | number;
	/** Creation timestamp */
	createdAt?: string | Date;
	/** Last update timestamp */
	updatedAt?: string | Date;
}

/**
 * Domain entity with soft delete
 */
export interface SoftDeletableEntity extends BaseDomainEntity {
	/** Deletion timestamp */
	deletedAt?: string | Date | null;
}

/**
 * Domain service interface
 */
export interface DomainService<TRequest = unknown, TResponse = unknown> {
	/** Execute the service operation */
	execute(request: TRequest): Promise<TResponse>;
}
