import axios from "axios"
import { z } from "zod"
import { JupiterApi } from "./schemas"
import { logZodErrors } from "./logger"

type TokenSearchRequest = z.infer<typeof JupiterApi.TokensSearch.REQUEST_SCHEMA>
type TokenSearchResponse = z.infer<
    typeof JupiterApi.TokensSearch.RESPONSE_SCHEMA
>

/**
 * Searches for Jupiter tokens based on a query string.
 * @param request - The search request containing the query.
 * @param config - Optional configuration for the request.
 * @param config.isStrict - If true, throws an error for invalid API responses.
 * @returns A promise that resolves to the token search response.
 * @throws Will throw an error if the request validation fails, or if `isStrict` is true and the response is invalid.
 */
export async function getTokensSearch(
    request: TokenSearchRequest,
    config?: {
        isStrict?: boolean
    },
): Promise<TokenSearchResponse> {
    const validatedRequest =
        JupiterApi.TokensSearch.REQUEST_SCHEMA.parse(request)

    const response = await axios.get(JupiterApi.TokensSearch.ROUTE, {
        params: validatedRequest,
    })

    const parseResult = JupiterApi.TokensSearch.RESPONSE_SCHEMA.safeParse(
        response.data,
    )

    if (!parseResult.success) {
        logZodErrors(parseResult.error, response.data)
        if (config?.isStrict) {
            throw new Error("Invalid response from Jupiter API")
        }
    }

    return response.data
}
