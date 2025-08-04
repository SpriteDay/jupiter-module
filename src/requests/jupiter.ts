import axios from "axios"
import { z } from "zod"
import { JupiterApi } from "./schemas.ts"
import { RateLimiter } from "./rate-limiter.ts"

type TokenSearchRequest = z.infer<typeof JupiterApi.TokenSearch.REQUEST_SCHEMA>
type TokenSearchResponse = z.infer<
    typeof JupiterApi.TokenSearch.RESPONSE_SCHEMA
>
export async function getTokenSearch(
    request: TokenSearchRequest,
    config: {
        isStrict?: boolean
        limiter: RateLimiter
    },
): Promise<TokenSearchResponse> {
    const validatedRequest =
        JupiterApi.TokenSearch.REQUEST_SCHEMA.parse(request)
    await config.limiter.acquire()

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
export async function getQuote(
    request: QuoteRequest,
    config: {
        isStrict?: boolean
        limiter: RateLimiter
    },
): Promise<QuoteResponse> {
    const validatedRequest = JupiterApi.Quote.REQUEST_SCHEMA.parse(request)
    await config.limiter.acquire()

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

export async function postSwap(
    request: SwapRequest,
    config: {
        isStrict?: boolean
        limiter: RateLimiter
    },
): Promise<SwapResponse> {
    const validatedRequest = JupiterApi.Swap.REQUEST_SCHEMA.parse(request)
    await config.limiter.acquire()

    const response = await axios.post(JupiterApi.Swap.ROUTE, validatedRequest)

    const parseResult = JupiterApi.Swap.RESPONSE_SCHEMA.safeParse(response.data)

    if (!parseResult.success && config?.isStrict) {
        throw new Error("Invalid response from Jupiter API")
    }

    return response.data
}
