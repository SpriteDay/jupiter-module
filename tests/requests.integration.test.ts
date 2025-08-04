import { describe, it, expect } from "vitest"
import { getTokenSearch, getQuote } from "../src/requests"
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
                    const result = await getTokenSearch(request, {
                        limiter,
                        isStrict: true,
                    })

                    expect(result).toBeInstanceOf(Array)
                    expect(result.length).toBeGreaterThan(0)
                    const usdc = result.find((t) => t.symbol === "USDC")
                    expect(usdc).toBeDefined()
                    expect(usdc?.name).toBe("USD Coin")
                },
                TEST_TIMEOUT,
            )
        })

        describe("getQuote", () => {
            it(
                "should get a real quote for SOL to USDC",
                async () => {
                    const request = {
                        inputMint: "So11111111111111111111111111111111111111112", // SOL
                        outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
                        amount: "100000000", // 0.1 SOL
                    }

                    const result = await getQuote(request, {
                        limiter,
                        isStrict: true,
                    })

                    expect(result).toBeDefined()
                    expect(result.inputMint).toBe(request.inputMint)
                    expect(result.outputMint).toBe(request.outputMint)
                    expect(result.inAmount).toBe(request.amount)
                    expect(Number.parseInt(result.outAmount, 10)).toBeGreaterThan(0)
                    expect(result.routePlan.length).toBeGreaterThan(0)
                },
                TEST_TIMEOUT,
            )
        })
    },
    { timeout: TEST_TIMEOUT },
)
