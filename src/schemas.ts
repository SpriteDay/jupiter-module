import { z } from "zod"

/**
 * Represents the data for a single Jupiter token.
 */
export const JupiterTokenDataSchema = z.object({
    /** The unique identifier (mint address) of the token. */
    id: z.string(),
    /** The name of the token. */
    name: z.string(),
    /** The symbol of the token. */
    symbol: z.string(),
    /** The URL of the token's icon. */
    icon: z.string().nullish(),
})

/**
 * The type representing the data for a single Jupiter token.
 */
export type JupiterTokenData = z.infer<typeof JupiterTokenDataSchema>

/**
 * Defines the endpoints, schemas, and methods for the Jupiter API.
 */
export const JupiterApi = {
    /**
     * API details for searching tokens.
     */
    TokensSearch: {
        METHOD: "GET",
        ROUTE: "https://lite-api.jup.ag/tokens/v2/search",
        REQUEST_SCHEMA: z.object({
            /** The query string to search for tokens. */
            query: z.string(),
        }),
        RESPONSE_SCHEMA: z.array(JupiterTokenDataSchema),
    },
} as const satisfies Record<
    string,
    {
        METHOD: string
        ROUTE: string
        REQUEST_SCHEMA: z.Schema
        RESPONSE_SCHEMA: z.Schema
    }
>
