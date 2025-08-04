import { z } from "zod"

const PlatformFeeSchema = z.object({
    amount: z.string().nullish(), // uint64
    feeBps: z.number().int().nullish(), // uint16
})

const SwapInfoSchema = z.object({
    ammKey: z.string(),
    label: z.string(),
    inputMint: z.string(),
    outputMint: z.string(),
    inAmount: z.string(),
    outAmount: z.string(),
    feeAmount: z.string(),
    feeMint: z.string(),
})

const RoutePlanSchema = z.object({
    swapInfo: SwapInfoSchema,
    percent: z.number().int(),
})

const QuoteResponseSchema = z.object({
    inputMint: z.string(),
    inAmount: z.string(),
    outputMint: z.string(),
    outAmount: z.string(),
    otherAmountThreshold: z.string(),
    swapMode: z.enum(["ExactIn", "ExactOut"]),
    slippageBps: z.number().int(),
    platformFee: PlatformFeeSchema.nullish(),
    priceImpactPct: z.string(),
    routePlan: z.array(RoutePlanSchema),

    contextSlot: z.number().int().nullish(),
    timeTaken: z.number().nullish(),
})

export const JupiterTokenDataSchema = z.object({
    id: z.string(),
    name: z.string(),
    symbol: z.string(),
    icon: z.string().nullish(),
})

export type JupiterTokenData = z.infer<typeof JupiterTokenDataSchema>

export const JupiterApi = {
    TokenSearch: {
        METHOD: "GET",
        ROUTE: "https://lite-api.jup.ag/tokens/v2/search",
        REQUEST_SCHEMA: z.object({
            query: z.string(),
        }),
        RESPONSE_SCHEMA: z.array(JupiterTokenDataSchema),
    },
    Quote: {
        METHOD: "GET",
        ROUTE: "https://lite-api.jup.ag/swap/v1/quote",
        REQUEST_SCHEMA: z.object({
            inputMint: z.string(),
            outputMint: z.string(),
            amount: z.string(), // uint64
            slippageBps: z.number().int().nullish(),
        }),
        RESPONSE_SCHEMA: QuoteResponseSchema,
    },
    Swap: {
        METHOD: "POST",
        ROUTE: "https://lite-api.jup.ag/swap/v1/swap",
        REQUEST_SCHEMA: z.object({
            userPublicKey: z.string(),
            quoteResponse: QuoteResponseSchema,
        }),
        RESPONSE_SCHEMA: z.object({
            swapTransaction: z.string(),
            lastValidBlockHeight: z.string(), // uint64
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
