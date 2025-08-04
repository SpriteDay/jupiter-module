import { JupiterRateLimitConfig } from "../config"

type RateLimiterConfig = {
    tokensAllocatedPerPeriod: number
    periodInSeconds: number
}

export class JupiterRateLimiter {
    private readonly name: string
    private readonly tokensPerMillisecond: number
    private maxTokens: number
    private tokens: number
    private lastRefill: number

    constructor(config: RateLimiterConfig, name: string) {
        this.name = name
        this.tokensPerMillisecond =
            config.tokensAllocatedPerPeriod / (config.periodInSeconds * 1000)
        this.maxTokens = config.tokensAllocatedPerPeriod
        this.tokens = this.maxTokens
        this.lastRefill = Date.now()
    }

    private refillTokens() {
        const now = Date.now()
        const elapsedTime = now - this.lastRefill
        const tokensToAdd = elapsedTime * this.tokensPerMillisecond
        this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd)
        this.lastRefill = now
    }

    private async wait(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    async acquire(): Promise<void> {
        while (true) {
            this.refillTokens()

            if (this.tokens >= 1) {
                this.tokens -= 1
                return
            }

            const timeToWait = (1 - this.tokens) / this.tokensPerMillisecond
            await this.wait(timeToWait)
        }
    }
}

export type RateLimiterPool = {
    highPriorityRateLimiter: JupiterRateLimiter
    lowPriorityRateLimiter: JupiterRateLimiter
}

export type RateLimiterPoolConfig = {
    highPriorityQuota: number
    lowPriorityQuota: number
}

export function createRateLimiters(
    config: RateLimiterPoolConfig,
): RateLimiterPool {
    const highPriorityRateLimiter = new JupiterRateLimiter(
        {
            tokensAllocatedPerPeriod: config.highPriorityQuota,
            periodInSeconds: JupiterRateLimitConfig.periodInSeconds,
        },
        "HighPriority",
    )

    const lowPriorityRateLimiter = new JupiterRateLimiter(
        {
            tokensAllocatedPerPeriod: config.lowPriorityQuota,
            periodInSeconds: JupiterRateLimitConfig.periodInSeconds,
        },
        "LowPriority",
    )

    return { highPriorityRateLimiter, lowPriorityRateLimiter }
}
