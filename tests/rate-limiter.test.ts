import { JupiterRateLimiter } from "../src/rate-limiter"
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest"

// Mock the logger to prevent console output during tests
vi.mock("../src/logger", () => ({
    logger: {
        log: vi.fn(),
    },
}))

describe("JupiterRateLimiter", () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("should execute the request function", async () => {
        const limiter = new JupiterRateLimiter({
            tokensAllocatedPerPeriod: 1,
            periodInSeconds: 1,
        })
        const requestFn = vi.fn().mockResolvedValue("test")

        const result = await limiter.rateLimitedRequest(requestFn)

        expect(requestFn).toHaveBeenCalledOnce()
        expect(result).toBe("test")
    })

    it("should wait for a token to be available before executing", async () => {
        const limiter = new JupiterRateLimiter({
            tokensAllocatedPerPeriod: 1,
            periodInSeconds: 1,
        })
        const requestFn1 = vi.fn().mockResolvedValue("first")
        const requestFn2 = vi.fn().mockResolvedValue("second")

        // First request should execute immediately
        const promise1 = limiter.rateLimitedRequest(requestFn1)
        await vi.advanceTimersByTimeAsync(0)
        expect(await promise1).toBe("first")
        expect(requestFn1).toHaveBeenCalledOnce()

        // Second request should wait
        const promise2 = limiter.rateLimitedRequest(requestFn2)

        // Wait for a short time to ensure the promise is pending
        await vi.advanceTimersByTimeAsync(500)
        expect(requestFn2).not.toHaveBeenCalled()

        // Advance time enough for a new token to be available
        await vi.advanceTimersByTimeAsync(500)

        // Now the second request should execute
        expect(await promise2).toBe("second")
        expect(requestFn2).toHaveBeenCalledOnce()
    })

    it("should handle multiple requests in parallel", async () => {
        const limiter = new JupiterRateLimiter({
            tokensAllocatedPerPeriod: 2,
            periodInSeconds: 1,
        })

        const requestFn = vi.fn().mockResolvedValue("ok")

        const promises = [
            limiter.rateLimitedRequest(requestFn),
            limiter.rateLimitedRequest(requestFn),
            limiter.rateLimitedRequest(requestFn),
        ]

        // Let the first two requests resolve
        await vi.advanceTimersByTimeAsync(0)

        // The third request should be pending
        await vi.advanceTimersByTimeAsync(500)
        expect(requestFn).toHaveBeenCalledTimes(2)

        // Let the third request resolve
        await vi.advanceTimersByTimeAsync(500)

        await Promise.all(promises)
        expect(requestFn).toHaveBeenCalledTimes(3)
    })
})
