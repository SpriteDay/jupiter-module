# Jupiter API Module

A lightweight TypeScript module that provides a flexible rate limiter and a `getTokensSearch` utility for the Jupiter API on Solana.

This module provides a `JupiterRateLimiter` to manage your API request rate when using the `@jup-ag/api`, and it also includes the `getTokensSearch` function, which is not available in the official SDK at the moment. It's designed to be unopinionated, giving you the flexibility to integrate it into your projects as you see fit.

## Features

-   **Token Search**: Find tokens available on Jupiter using the `getTokensSearch` function.
-   **Rate Limiting**: Includes a flexible `JupiterRateLimiter` to manage your API request rate.
-   **Type-Safe**: Written in TypeScript and uses Zod for robust schema validation.
-   **ESM and CJS support**: The package is published with both EcmaScript and CommonJS modules.

## Installation

This module lists `axios` and `zod` as `peerDependencies`. You will need to install them in your project if you haven't already.

You can install the module and its peer dependencies using your package manager:

```bash
pnpm add @spriteday/jupiter-module axios zod
```

```bash
npm install @spriteday/jupiter-module axios zod
```

```bash
yarn add @spriteday/jupiter-module axios zod
```

```bash
bun add @spriteday/jupiter-module axios zod
```

## Quick Start

Here's a quick example of how to search for a token and get a swap quote with rate limiting.

```typescript
import {
    JupiterRateLimiter,
    getTokensSearch,
} from "@spriteday/jupiter-module"
import { createJupiterApiClient } from "@jup-ag/api"

// Jupiter's API has rate limits. It's recommended to use the built-in rate limiter.
// This example creates a limiter that allows 100 requests per minute.
const limiter = new JupiterRateLimiter({
    tokensAllocatedPerPeriod: 100,
    periodInSeconds: 60,
})

const jupiterApi = createJupiterApiClient()

async function main() {
    try {
        const tokens = await limiter.request(() =>
            getTokensSearch({ query: "USDC" }),
        )
        console.log("Found tokens:", tokens)

        const quote = await limiter.request(() =>
            jupiterApi.quoteGet({
                inputMint: "So11111111111111111111111111111111111111112", // SOL
                outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
                amount: "100000000", // 1 SOL
            }),
        )
        console.log("Received quote:", quote)
    } catch (error) {
        console.error("Error:", error)
    }
}

main()
```

## API

### `getTokensSearch(request, config)`

Searches for Jupiter tokens based on a query string.

-   `request`: `{ query: string }`
-   `config.isStrict` (optional): `boolean` - If `true`, throws an error for invalid API responses.

### `JupiterRateLimiter`

A token bucket rate limiter to manage API request rates.

**Constructor:** `new JupiterRateLimiter(config)`

-   `config.tokensAllocatedPerPeriod`: `number` - The total number of requests allocated for each period.
-   `config.periodInSeconds`: `number` - The time period in seconds for which the tokens are allocated.
-   `config.name` (optional): `string` - An optional name for the rate limiter instance, used for logging.
-   `config.detailedLogging` (optional): `boolean` - If `true`, enables detailed logging for rate limiter operations.

**Methods:**

-   `request<T>(requestFn: () => Promise<T>): Promise<T>`: Executes a request after acquiring a token from the rate limiter.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.
