import { describe, it, expect, vi, beforeEach } from "vitest"
import axios from "axios"
import { getTokensSearch } from "../src/requests"
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

describe("API requests", () => {
    beforeEach(() => {
        vi.resetAllMocks()
    })

    describe("getTokensSearch", () => {
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

            const result = await getTokensSearch(mockRequest)

            expect(mockedAxios.get).toHaveBeenCalledWith(
                JupiterApi.TokensSearch.ROUTE,
                { params: mockRequest },
            )
            expect(result).toEqual(mockResponse)
            expect(mockedLogZodErrors).not.toHaveBeenCalled()
        })

        it("should log an error and not throw when response is invalid and isStrict is false", async () => {
            const mockRequest = { query: "SOL" }
            const invalidResponse = { data: "invalid data" }

            mockedAxios.get.mockResolvedValue(invalidResponse)

            const result = await getTokensSearch(mockRequest)

            expect(result).toEqual(invalidResponse.data)
            expect(mockedLogZodErrors).toHaveBeenCalled()
        })

        it("should throw an error when response is invalid and isStrict is true", async () => {
            const mockRequest = { query: "SOL" }
            const invalidResponse = { data: "invalid data" }

            mockedAxios.get.mockResolvedValue(invalidResponse)

            await expect(
                getTokensSearch(mockRequest, { isStrict: true }),
            ).rejects.toThrow("Invalid response from Jupiter API")
            expect(mockedLogZodErrors).toHaveBeenCalled()
        })
    })
})
