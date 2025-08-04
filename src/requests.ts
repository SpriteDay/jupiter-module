import axios from "axios"
import { z } from "zod"
import { JupiterApi } from "./schemas"
import { JupiterRateLimiter } from "./rate-limiter"

type TokenSearchRequest = z.infer<typeof JupiterApi.TokenSearch.REQUEST_SCHEMA>
type TokenSearchResponse = z.infer<
    typeof JupiterApi.TokenSearch.RESPONSE_SCHEMA
>

/**
 * Searches for Jupiter tokens based on a query string.
 * @param request - The search request containing the query.
 * @param config - Optional configuration for the request.
 * @param config.isStrict - If true, throws an error for invalid API responses.
 * @param config.limiter - A JupiterRateLimiter instance to handle rate limiting.
 * @returns A promise that resolves to the token search response.
 * @throws Will throw an error if the request validation fails, or if `isStrict` is true and the response is invalid.
 */
export async function getTokenSearch(
    request: TokenSearchRequest,
    config?: {
        isStrict?: boolean
        limiter?: JupiterRateLimiter
    },
): Promise<TokenSearchResponse> {
    const validatedRequest =
        JupiterApi.TokenSearch.REQUEST_SCHEMA.parse(request)

    if (config?.limiter) {
        await config.limiter.acquire()
    }

    const response = await axios.get(JupiterApi.TokenSearch.ROUTE, {
        params: validatedRequest,
    })

    const parseResult = JupiterApi.TokenSearch.RESPONSE_SCHEMA.safeParse(
        response.data,
    )

    if (!parseResult.success && config?.isStrict) {
        throw new Error("Invalid response from Jupiter API")
    }

    return response.data
}

type QuoteRequest = z.infer<typeof JupiterApi.Quote.REQUEST_SCHEMA>
type QuoteResponse = z.infer<typeof JupiterApi.Quote.RESPONSE_SCHEMA>

/**
 * Gets a quote for a token swap from the Jupiter API.
 * @param request - The quote request details.
 * @param config - Optional configuration for the request.
 * @param config.isStrict - If true, throws an error for invalid API responses.
 * @param config.limiter - A JupiterRateLimiter instance to handle rate limiting.
 * @returns A promise that resolves to the quote response.
 * @throws Will throw an error if the request validation fails, or if `isStrict` is true and the response is invalid.
 */
export async function getQuote(
    request: QuoteRequest,
    config?: {
        isStrict?: boolean
        limiter?: JupiterRateLimiter
    },
): Promise<QuoteResponse> {
    const validatedRequest = JupiterApi.Quote.REQUEST_SCHEMA.parse(request)

    if (config?.limiter) {
        await config.limiter.acquire()
    }

    const response = await axios.get(JupiterApi.Quote.ROUTE, {
        params: validatedRequest,
    })

    const parseResult = JupiterApi.Quote.RESPONSE_SCHEMA.safeParse(
        response.data,
    )

    if (!parseResult.success && config?.isStrict) {
        throw new Error("Invalid response from Jupiter API")
    }

    return response.data
}

type SwapRequest = z.infer<typeof JupiterApi.Swap.REQUEST_SCHEMA>
type SwapResponse = z.infer<typeof JupiterApi.Swap.RESPONSE_SCHEMA>

/**
 * Performs a token swap using the Jupiter API.
 * @param request - The swap request, including user public key and the quote response.
 * @param config - Optional configuration for the request.
 * @param config.isStrict - If true, throws an error for invalid API responses.
 * @param config.limiter - A JupiterRateLimiter instance to handle rate limiting.
 * @returns A promise that resolves to the swap response, containing the swap transaction.
 * @throws Will throw an error if the request validation fails, or if `isStrict` is true and the response is invalid.
 */
export async function postSwap(
    request: SwapRequest,
    config?: {
        isStrict?: boolean
        limiter?: JupiterRateLimiter
    },
): Promise<SwapResponse> {
    const validatedRequest = JupiterApi.Swap.REQUEST_SCHEMA.parse(request)

    if (config?.limiter) {
        await config.limiter.acquire()
    }

    const response = await axios.post(JupiterApi.Swap.ROUTE, validatedRequest)

    const parseResult = JupiterApi.Swap.RESPONSE_SCHEMA.safeParse(response.data)

    if (!parseResult.success && config?.isStrict) {
        throw new Error("Invalid response from Jupiter API")
    }

    return response.data
}
