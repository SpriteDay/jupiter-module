import { describe, it, expect, vi, beforeEach } from "vitest"
import axios from "axios"
import { getTokenSearch, getQuote, postSwap } from "../src/requests"
import { JupiterApi } from "../src/schemas"
import { logZodErrors } from "../src/logger"

// Mock axios
vi.mock("axios")
const mockedAxios = vi.mocked(axios, true)

// Mock logger
vi.mock("../src/logger", () => ({
    logZodErrors: vi.fn(),
    logger: {
        log: vi.fn(),
        groupCollapsed: vi.fn(),
        groupEnd: vi.fn(),
        dir: vi.fn(),
    },
}))
const mockedLogZodErrors = vi.mocked(logZodErrors)

const MOCK_QUOTE_RESPONSE = {
    inputMint: "So11111111111111111111111111111111111111112",
    inAmount: "100000000",
    outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    outAmount: "99000000",
    otherAmountThreshold: "98000000",
    swapMode: "ExactIn" as const,
    slippageBps: 50,
    priceImpactPct: "0.1",
    routePlan: [
        {
            swapInfo: {
                ammKey: "someAmmKey",
                label: "someLabel",
                inputMint: "So11111111111111111111111111111111111111112",
                outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                inAmount: "100000000",
                outAmount: "99000000",
                feeAmount: "100000",
                feeMint: "So11111111111111111111111111111111111111112",
            },
            percent: 100,
        },
    ],
}

describe("API requests", () => {
    beforeEach(() => {
        vi.resetAllMocks()
    })

    describe("getTokenSearch", () => {
        it("should return token search results on successful request", async () => {
            const mockRequest = { query: "SOL" }
            const mockResponse = [
                {
                    id: "So11111111111111111111111111111111111111112",
                    name: "Solana",
                    symbol: "SOL",
                },
            ]

            mockedAxios.get.mockResolvedValue({ data: mockResponse })

            const result = await getTokenSearch(mockRequest)

            expect(mockedAxios.get).toHaveBeenCalledWith(
                JupiterApi.TokenSearch.ROUTE,
                { params: mockRequest },
            )
            expect(result).toEqual(mockResponse)
            expect(mockedLogZodErrors).not.toHaveBeenCalled()
        })

        it("should log an error and not throw when response is invalid and isStrict is false", async () => {
            const mockRequest = { query: "SOL" }
            const invalidResponse = { data: "invalid data" }

            mockedAxios.get.mockResolvedValue(invalidResponse)

            const result = await getTokenSearch(mockRequest)

            expect(result).toEqual(invalidResponse.data)
            expect(mockedLogZodErrors).toHaveBeenCalled()
        })

        it("should throw an error when response is invalid and isStrict is true", async () => {
            const mockRequest = { query: "SOL" }
            const invalidResponse = { data: "invalid data" }

            mockedAxios.get.mockResolvedValue(invalidResponse)

            await expect(
                getTokenSearch(mockRequest, { isStrict: true }),
            ).rejects.toThrow("Invalid response from Jupiter API")
            expect(mockedLogZodErrors).toHaveBeenCalled()
        })
    })

    describe("getQuote", () => {
        const mockRequest = {
            inputMint: "So11111111111111111111111111111111111111112",
            outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            amount: "100000000",
        }

        it("should return a quote on successful request", async () => {
            mockedAxios.get.mockResolvedValue({ data: MOCK_QUOTE_RESPONSE })

            const result = await getQuote(mockRequest)

            expect(mockedAxios.get).toHaveBeenCalledWith(JupiterApi.Quote.ROUTE, {
                params: mockRequest,
            })
            expect(result).toEqual(MOCK_QUOTE_RESPONSE)
            expect(mockedLogZodErrors).not.toHaveBeenCalled()
        })

        it("should log an error and not throw when response is invalid and isStrict is false", async () => {
            const invalidResponse = { data: "invalid quote" }
            mockedAxios.get.mockResolvedValue(invalidResponse)

            const result = await getQuote(mockRequest)

            expect(result).toEqual(invalidResponse.data)
            expect(mockedLogZodErrors).toHaveBeenCalled()
        })

        it("should throw an error when response is invalid and isStrict is true", async () => {
            const invalidResponse = { data: "invalid quote" }
            mockedAxios.get.mockResolvedValue(invalidResponse)

            await expect(getQuote(mockRequest, { isStrict: true })).rejects.toThrow(
                "Invalid response from Jupiter API",
            )
            expect(mockedLogZodErrors).toHaveBeenCalled()
        })
    })

    describe("postSwap", () => {
        const mockRequest = {
            userPublicKey: "userPublicKey",
            quoteResponse: MOCK_QUOTE_RESPONSE,
        }

        const mockResponse = {
            swapTransaction: "someEncodedTransaction",
            lastValidBlockHeight: "123456",
        }

        it("should return a swap transaction on successful request", async () => {
            mockedAxios.post.mockResolvedValue({ data: mockResponse })
            const result = await postSwap(mockRequest)
            expect(mockedAxios.post).toHaveBeenCalledWith(
                JupiterApi.Swap.ROUTE,
                mockRequest,
            )
            expect(result).toEqual(mockResponse)
            expect(mockedLogZodErrors).not.toHaveBeenCalled()
        })

        it("should log an error and not throw when response is invalid and isStrict is false", async () => {
            const invalidResponse = { data: "invalid swap" }
            mockedAxios.post.mockResolvedValue(invalidResponse)
            const result = await postSwap(mockRequest)
            expect(result).toEqual(invalidResponse.data)
            expect(mockedLogZodErrors).toHaveBeenCalled()
        })

        it("should throw an error when response is invalid and isStrict is true", async () => {
            const invalidResponse = { data: "invalid swap" }
            mockedAxios.post.mockResolvedValue(invalidResponse)
            await expect(postSwap(mockRequest, { isStrict: true })).rejects.toThrow(
                "Invalid response from Jupiter API",
            )
            expect(mockedLogZodErrors).toHaveBeenCalled()
        })
    })
})
