import { JupiterRateLimiter } from "../src/rate-limiter"
import { describe, it, expect, vi, afterEach } from "vitest"

// Mock the logger to prevent console output during tests
vi.mock("../src/logger", () => ({
    logger: {
        log: vi.fn(),
        groupCollapsed: vi.fn(),
        groupEnd: vi.fn(),
        dir: vi.fn(),
    },
}))

describe("JupiterRateLimiter", () => {
    afterEach(() => {
        vi.useRealTimers()
    })

    it("should allow acquiring a token if available", async () => {
        const limiter = new JupiterRateLimiter({
            tokensAllocatedPerPeriod: 1,
            periodInSeconds: 1,
        })
        await expect(limiter.acquire()).resolves.toBeUndefined()
    })

    it("should block acquiring a token if none are available", async () => {
        vi.useFakeTimers()

        const limiter = new JupiterRateLimiter({
            tokensAllocatedPerPeriod: 1,
            periodInSeconds: 1,
        })

        // Acquire the first token
        await limiter.acquire()

        // The second acquire should wait
        const acquirePromise = limiter.acquire()

        // Wait for a short time to ensure the promise is pending
        await vi.advanceTimersByTimeAsync(500)

        let resolved = false
        acquirePromise.then(() => {
            resolved = true
        })

        // At this point, the promise should not have resolved
        expect(resolved).toBe(false)

        // Advance time enough for a new token to be available
        await vi.advanceTimersByTimeAsync(1000)

        // Now the promise should resolve
        await acquirePromise
        expect(resolved).toBe(true)
    })

    it("should refill tokens over time", async () => {
        vi.useFakeTimers()
        const limiter = new JupiterRateLimiter({
            tokensAllocatedPerPeriod: 2,
            periodInSeconds: 2,
        })

        // Use up all tokens
        await limiter.acquire()
        await limiter.acquire()

        let resolved = false
        const acquirePromise = limiter.acquire().then(() => {
            resolved = true
        })

        // Not enough time has passed
        await vi.advanceTimersByTimeAsync(500)
        expect(resolved).toBe(false)

        // Enough time for one token
        await vi.advanceTimersByTimeAsync(500)
        await acquirePromise
        expect(resolved).toBe(true)
    })
})
