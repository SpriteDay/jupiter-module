import { describe, it, expect } from "vitest"
import { getTokenSearch } from "../src/requests"
import { JupiterRateLimiter } from "../src/rate-limiter"

// Increase the timeout for these tests as they involve real network requests
const TEST_TIMEOUT = 30000 // 30 seconds

// A shared rate limiter to be respectful to the Jupiter API during tests
const limiter = new JupiterRateLimiter({
    tokensAllocatedPerPeriod: 10,
    periodInSeconds: 10,
    detailedLogging: true,
})

describe(
    "API integration tests",
    () => {
        describe("getTokenSearch", () => {
            it(
                "should fetch real token data for 'USDC'",
                async () => {
                    const request = { query: "USDC" }
                    const result = await limiter.request(() =>
                        getTokenSearch(request, {
                            isStrict: true,
                        }),
                    )

                    expect(result).toBeInstanceOf(Array)
                    expect(result.length).toBeGreaterThan(0)
                    const usdc = result.find((t) => t.symbol === "USDC")
                    expect(usdc).toBeDefined()
                    expect(usdc?.name).toBe("USD Coin")
                },
                TEST_TIMEOUT,
            )
        })
    },
    { timeout: TEST_TIMEOUT },
)
