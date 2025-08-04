import { logger } from "./logger"

/**
 * Configuration for creating a JupiterRateLimiter.
 */
type JupiterRateLimiterConfig = {
	/**
	 * The total number of requests allocated for each period.
	 */
	tokensAllocatedPerPeriod: number
	/**
	 * The time period in seconds for which the tokens are allocated.
	 */
	periodInSeconds: number
	/**
	 * An optional name for the rate limiter instance, used for logging.
	 */
	name?: string
	/**
	 * If true, enables detailed logging for rate limiter operations.
	 */
	detailedLogging?: boolean
}

/**
 * A token bucket rate limiter for Jupiter API requests.
 * It ensures that requests do not exceed a specified rate.
 */
export class JupiterRateLimiter {
	private readonly name: string
	private readonly tokensPerMillisecond: number
	private maxTokens: number
	private tokens: number
	private lastRefill: number
	private detailedLogging: boolean

	/**
	 * Creates an instance of JupiterRateLimiter.
	 * @param config - The configuration for the rate limiter.
	 */
	constructor(config: JupiterRateLimiterConfig) {
		this.name = config.name ?? "JupiterRateLimiter"
		this.tokensPerMillisecond =
			config.tokensAllocatedPerPeriod / (config.periodInSeconds * 1000)
		this.maxTokens = config.tokensAllocatedPerPeriod
		this.tokens = this.maxTokens
		this.lastRefill = Date.now()
		this.detailedLogging = config.detailedLogging ?? false

		if (this.detailedLogging) {
			logger.log(
				`[${this.name}] Initialized with ${config.tokensAllocatedPerPeriod} tokens per ${config.periodInSeconds}s.`,
			)
		}
	}

	private refillTokens() {
		const now = Date.now()
		const elapsedTime = now - this.lastRefill
		if (elapsedTime <= 0) {
			return
		}

		const tokensToAdd = elapsedTime * this.tokensPerMillisecond
		const oldTokens = this.tokens
		this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd)
		this.lastRefill = now

		if (this.detailedLogging && this.tokens > oldTokens) {
			logger.log(
				`[${this.name}] Refilled ${
					this.tokens - oldTokens
				} tokens. Current tokens: ${this.tokens}`,
			)
		}
	}

	private async wait(ms: number): Promise<void> {
		if (this.detailedLogging) {
			logger.log(`[${this.name}] Waiting for ${Math.ceil(ms)}ms to refill tokens.`)
		}
		return new Promise((resolve) => setTimeout(resolve, ms))
	}

	/**
	 * Acquires a token from the bucket, waiting if necessary.
	 * This method will block until a token is available.
	 */
	async acquire(): Promise<void> {
		if (this.detailedLogging) {
			logger.log(
				`[${this.name}] Attempting to acquire token. Available: ${this.tokens}`,
			)
		}

		while (true) {
			this.refillTokens()

			if (this.tokens >= 1) {
				this.tokens -= 1
				if (this.detailedLogging) {
					logger.log(
						`[${this.name}] Token acquired. Tokens remaining: ${this.tokens}`,
					)
				}
				return
			}

			const timeToWait = (1 - this.tokens) / this.tokensPerMillisecond
			await this.wait(timeToWait)
		}
	}
}
