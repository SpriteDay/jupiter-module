/**
 * These are the token configurations for each tier from Jupiter API.
 * Based on the tier, the amount of tokens allocated per period are different.
 *
 * For example, in Pro II, you will be allocated 500 tokens every 10 seconds, which is approximately 3,000 requests per minute.
 *
 * More info: https://dev.jup.ag/docs/api-rate-limit
 */
export const JupiterRateLimitConfig = {
    /**
     * The approximate number of requests you can make per minute.
     * This is for reference. The rate limiter uses tokensAllocatedPerPeriod and periodInSeconds for calculations.
     * (tokensAllocatedPerPeriod / periodInSeconds) * 60
     */
    requestsPerMinute: 60,

    /**
     * The number of tokens allocated per period.
     */
    tokensAllocatedPerPeriod: 60,

    /**
     * The period in seconds for token allocation.
     */
    periodInSeconds: 60,
}
