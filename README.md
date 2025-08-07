# Jupiter API Rate Limiter

A lightweight TypeScript module that provides a flexible rate limiter for the official Jupiter SDK on Solana.

This module provides a simple `JupiterRateLimiter` to manage your API request rate when using the `@jup-ag/api`. It's designed to be unopinionated, giving you the flexibility to integrate it into your projects as you see fit.

## Features

-   **Rate Limiting**: Includes a flexible `JupiterRateLimiter` to manage your API request rate.
-   **Type-Safe**: Written in TypeScript to provide strong type safety.
-   **ESM and CJS support**: The package is published with both EcmaScript and CommonJS modules.

## Installation

You can install the module using your package manager:

```bash
pnpm add @spriteday/jupiter-module
```

```bash
npm install @spriteday/jupiter-module
```

```bash
yarn add @spriteday/jupiter-module
```

```bash
bun add @spriteday/jupiter-module
```

## Quick Start

Here's a quick example of how to get a swap quote with rate limiting.

```typescript
import { JupiterRateLimiter } from "@spriteday/jupiter-module";
import { createJupiterApiClient } from "@jup-ag/api";

// Jupiter's API has rate limits. It's recommended to use the built-in rate limiter.
// This example creates a limiter that allows 100 requests per minute.
const limiter = new JupiterRateLimiter({
  tokensAllocatedPerPeriod: 100,
  periodInSeconds: 60,
});

const jupiterApi = createJupiterApiClient();

async function fetchQuote() {
  try {
    const quote = await limiter.rateLimitedRequest(() =>
      jupiterApi.quoteGet({
        inputMint: "So11111111111111111111111111111111111111112", // SOL
        outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
        amount: "100000000", // 1 SOL
      })
    );
    console.log("Received quote:", quote);
  } catch (error) {
    console.error("Error fetching quote:", error);
  }
}

fetchQuote();
```

## API

### `JupiterRateLimiter`

A token bucket rate limiter to manage API request rates.

**Constructor:** `new JupiterRateLimiter(config)`

-   `config.tokensAllocatedPerPeriod`: `number` - The total number of requests allocated for each period.
-   `config.periodInSeconds`: `number` - The time period in seconds for which the tokens are allocated.
-   `config.name` (optional): `string` - An optional name for the rate limiter instance, used for logging.
-   `config.detailedLogging` (optional): `boolean` - If `true`, enables detailed logging for rate limiter operations.

**Methods:**

-   `rateLimitedRequest<T>(requestFn: () => Promise<T>): Promise<T>`: Executes a request after acquiring a token from the rate limiter.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.
