import { z } from "zod"

/**
 * Represents trading statistics for a specific time period.
 */
export const JupiterTokenStatsSchema = z.object({
    /** Price change percentage. */
    priceChange: z.number().nullish(),
    /** Holder count change. */
    holderChange: z.number().nullish(),
    /** Liquidity change percentage. */
    liquidityChange: z.number().nullish(),
    /** Volume change percentage. */
    volumeChange: z.number().nullish(),
    /** Buy volume in the period. */
    buyVolume: z.number().nullish(),
    /** Sell volume in the period. */
    sellVolume: z.number().nullish(),
    /** Organic buy volume. */
    buyOrganicVolume: z.number().nullish(),
    /** Organic sell volume. */
    sellOrganicVolume: z.number().nullish(),
    /** Number of buy transactions. */
    numBuys: z.number().nullish(),
    /** Number of sell transactions. */
    numSells: z.number().nullish(),
    /** Number of unique traders. */
    numTraders: z.number().nullish(),
    /** Number of organic buyers. */
    numOrganicBuyers: z.number().nullish(),
    /** Net buyers count. */
    numNetBuyers: z.number().nullish(),
})

/**
 * The type representing trading statistics for a time period.
 */
export type JupiterTokenStats = z.infer<typeof JupiterTokenStatsSchema>

/**
 * Represents the first pool information.
 */
export const JupiterFirstPoolSchema = z.object({
    /** Pool identifier. */
    id: z.string(),
    /** Pool creation timestamp. */
    createdAt: z.string(),
})

/**
 * The type representing first pool information.
 */
export type JupiterFirstPool = z.infer<typeof JupiterFirstPoolSchema>

/**
 * Represents audit information for a token.
 */
export const JupiterAuditSchema = z.object({
    /** Whether the token is flagged as suspicious. */
    isSus: z.boolean().nullish(),
    /** Whether mint authority is disabled. */
    mintAuthorityDisabled: z.boolean().nullish(),
    /** Whether freeze authority is disabled. */
    freezeAuthorityDisabled: z.boolean().nullish(),
    /** Percentage held by top holders. */
    topHoldersPercentage: z.number().nullish(),
    /** Percentage held by developer. */
    devBalancePercentage: z.number().nullish(),
    /** Number of developer migrations. */
    devMigrations: z.number().nullish(),
})

/**
 * The type representing audit information.
 */
export type JupiterAudit = z.infer<typeof JupiterAuditSchema>

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
    /** The number of decimal places for the token. */
    decimals: z.number().nullish(),
    /** Twitter profile URL. */
    twitter: z.string().nullish(),
    /** Telegram group URL. */
    telegram: z.string().nullish(),
    /** Website URL. */
    website: z.string().nullish(),
    /** Developer wallet address. */
    dev: z.string().nullish(),
    /** Circulating supply. */
    circSupply: z.number().nullish(),
    /** Total supply. */
    totalSupply: z.number().nullish(),
    /** Token program address. */
    tokenProgram: z.string().nullish(),
    /** Launchpad identifier. */
    launchpad: z.string().nullish(),
    /** Partner configuration. */
    partnerConfig: z.string().nullish(),
    /** Graduated pool address. */
    graduatedPool: z.string().nullish(),
    /** Graduation timestamp. */
    graduatedAt: z.string().nullish(),
    /** Number of token holders. */
    holderCount: z.number().nullish(),
    /** Fully diluted valuation. */
    fdv: z.number().nullish(),
    /** Market capitalization. */
    mcap: z.number().nullish(),
    /** Current USD price. */
    usdPrice: z.number().nullish(),
    /** Price block identifier. */
    priceBlockId: z.number().nullish(),
    /** Available liquidity. */
    liquidity: z.number().nullish(),
    /** 5-minute trading statistics. */
    stats5m: JupiterTokenStatsSchema.nullish(),
    /** 1-hour trading statistics. */
    stats1h: JupiterTokenStatsSchema.nullish(),
    /** 6-hour trading statistics. */
    stats6h: JupiterTokenStatsSchema.nullish(),
    /** 24-hour trading statistics. */
    stats24h: JupiterTokenStatsSchema.nullish(),
    /** First pool information. */
    firstPool: JupiterFirstPoolSchema.nullish(),
    /** Audit information. */
    audit: JupiterAuditSchema.nullish(),
    /** Organic trading score. */
    organicScore: z.number().nullish(),
    /** Organic score label (high, medium, low). */
    organicScoreLabel: z.enum(["high", "medium", "low"]).nullish(),
    /** Whether the token is verified. */
    isVerified: z.boolean().nullish(),
    /** List of centralized exchanges where the token is listed. */
    cexes: z.array(z.string()).nullish(),
    /** Tags associated with the token. */
    tags: z.array(z.string()).nullish(),
    /** Last update timestamp. */
    updatedAt: z.string().nullish(),
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
