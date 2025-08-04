import { z } from "zod"

/**
 * Represents the platform fee structure in a Jupiter API response.
 */
const PlatformFeeSchema = z.object({
    /** The amount of the platform fee, in lamports. */
    amount: z.string().nullish(), // uint64
    /** The fee in basis points. */
    feeBps: z.number().int().nullish(), // uint16
})

/**
 * Detailed information about a specific swap.
 */
const SwapInfoSchema = z.object({
    /** The key of the AMM (Automated Market Maker) used for the swap. */
    ammKey: z.string(),
    /** A descriptive label for the swap. */
    label: z.string(),
    /** The mint address of the input token. */
    inputMint: z.string(),
    /** The mint address of the output token. */
    outputMint: z.string(),
    /** The amount of the input token. */
    inAmount: z.string(),
    /** The amount of the output token. */
    outAmount: z.string(),
    /** The amount of the fee paid for the swap. */
    feeAmount: z.string(),
    /** The mint address of the token used for the fee. */
    feeMint: z.string(),
})

/**
 * A single route in a swap plan.
 */
const RoutePlanSchema = z.object({
    /** The details of the swap for this part of the route. */
    swapInfo: SwapInfoSchema,
    /** The percentage of the total swap amount that this route handles. */
    percent: z.number().int(),
})

/**
 * The response schema for a quote request.
 */
const QuoteResponseSchema = z.object({
    /** The mint address of the input token. */
    inputMint: z.string(),
    /** The amount of the input token. */
    inAmount: z.string(),
    /** The mint address of the output token. */
    outputMint: z.string(),
    /** The amount of the output token. */
    outAmount: z.string(),
    /** The threshold for the other amount in the swap. */
    otherAmountThreshold: z.string(),
    /** The swap mode, either "ExactIn" or "ExactOut". */
    swapMode: z.enum(["ExactIn", "ExactOut"]),
    /** The slippage tolerance in basis points. */
    slippageBps: z.number().int(),
    /** The platform fee details, if applicable. */
    platformFee: PlatformFeeSchema.nullish(),
    /** The price impact of the swap as a percentage string. */
    priceImpactPct: z.string(),
    /** The plan of routes for the swap. */
    routePlan: z.array(RoutePlanSchema),

    /** The blockchain context slot for the quote. */
    contextSlot: z.number().int().nullish(),
    /** The time taken to generate the quote, in seconds. */
    timeTaken: z.number().nullish(),
})

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
    TokenSearch: {
        METHOD: "GET",
        ROUTE: "https://lite-api.jup.ag/tokens/v2/search",
        REQUEST_SCHEMA: z.object({
            /** The query string to search for tokens. */
            query: z.string(),
        }),
        RESPONSE_SCHEMA: z.array(JupiterTokenDataSchema),
    },
    /**
     * API details for getting a swap quote.
     */
    Quote: {
        METHOD: "GET",
        ROUTE: "https://lite-api.jup.ag/swap/v1/quote",
        REQUEST_SCHEMA: z.object({
            /** The mint address of the input token. */
            inputMint: z.string(),
            /** The mint address of the output token. */
            outputMint: z.string(),
            /** The amount of the input token, as a string. */
            amount: z.string(), // uint64
            /** The slippage tolerance in basis points. */
            slippageBps: z.number().int().nullish(),
        }),
        RESPONSE_SCHEMA: QuoteResponseSchema,
    },
    /**
     * API details for executing a swap.
     */
    Swap: {
        METHOD: "POST",
        ROUTE: "https://lite-api.jup.ag/swap/v1/swap",
        REQUEST_SCHEMA: z.object({
            /** The public key of the user performing the swap. */
            userPublicKey: z.string(),
            /** The quote response received from the Quote endpoint. */
            quoteResponse: QuoteResponseSchema,
        }),
        RESPONSE_SCHEMA: z.object({
            /** The serialized swap transaction. */
            swapTransaction: z.string(),
            /** The last valid block height for the transaction. */
            lastValidBlockHeight: z.string(), // uint64
            /** The prioritization fee in lamports. */
            prioritizationFeeLamports: z.string().nullish(), // uint64
        }),
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
