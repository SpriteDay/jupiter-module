# Jupiter API Module

A lightweight TypeScript module for interacting with the Jupiter API on Solana.

This module provides simple, direct access to Jupiter's core functionalities: searching for tokens, getting swap quotes, and executing swaps. It's designed to be unopinionated, giving you the flexibility to integrate it into your projects as you see fit.

## Features

-   **Token Search**: Find tokens available on Jupiter.
-   **Swap Quotes**: Get real-time swap quotes.
-   **Execute Swaps**: Generate swap transactions.
-   **Rate Limiting**: Includes a flexible `JupiterRateLimiter` to manage your API request rate.
-   **Type-Safe**: Uses Zod for robust schema validation and provides strong type safety with TypeScript.
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

Here's a quick example of how to get a swap quote.

```typescript
import { getQuote, JupiterRateLimiter } from "@spriteday/jupiter-module";

// Jupiter's API has rate limits. It's recommended to use the built-in rate limiter.
// This example creates a limiter that allows 100 requests per minute.
const limiter = new JupiterRateLimiter({
  tokensAllocatedPerPeriod: 100,
  periodInSeconds: 60,
});

async function fetchQuote() {
  try {
    const quote = await getQuote(
      {
        inputMint: "So11111111111111111111111111111111111111112", // SOL
        outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
        amount: "100000000", // 1 SOL
      },
      {
        limiter, // Pass the limiter to the request
      }
    );
    console.log("Received quote:", quote);
  } catch (error) {
    console.error("Error fetching quote:", error);
  }
}

fetchQuote();
```

## API

### `getTokenSearch(request, config)`

Searches for Jupiter tokens based on a query string.

-   `request`: `z.infer<typeof JupiterApi.TokenSearch.REQUEST_SCHEMA>`
-   `config.isStrict` (optional): `boolean` - If `true`, throws an error for invalid API responses.
-   `config.limiter` (optional): `JupiterRateLimiter` - A rate limiter instance.

### `getQuote(request, config)`

Gets a quote for a token swap from the Jupiter API.

-   `request`: `z.infer<typeof JupiterApi.Quote.REQUEST_SCHEMA>`
-   `config.isStrict` (optional): `boolean`
-   `config.limiter` (optional): `JupiterRateLimiter`

### `postSwap(request, config)`

Performs a token swap using the Jupiter API.

-   `request`: `z.infer<typeof JupiterApi.Swap.REQUEST_SCHEMA>`
-   `config.isStrict` (optional): `boolean`
-   `config.limiter` (optional): `JupiterRateLimiter`

### `JupiterRateLimiter`

A token bucket rate limiter to manage API request rates.

**Constructor:** `new JupiterRateLimiter(config)`

-   `config.tokensAllocatedPerPeriod`: `number` - The total number of requests allocated for each period.
-   `config.periodInSeconds`: `number` - The time period in seconds for which the tokens are allocated.
-   `config.name` (optional): `string` - An optional name for the rate limiter instance, used for logging.
-   `config.detailedLogging` (optional): `boolean` - If `true`, enables detailed logging for rate limiter operations.

**Methods:**

-   `acquire()`: Acquires a token from the bucket, waiting if necessary. This method will block until a token is available.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.
