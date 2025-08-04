import { logger } from "./logger"

export class JupiterRateLimiter {
    private readonly name: string | undefined
    private readonly tokensPerMillisecond: number
    private maxTokens: number
    private tokens: number
    private lastRefill: number
    private detailedLogging: boolean | undefined

    constructor(config: {
        tokensAllocatedPerPeriod: number
        periodInSeconds: number
        name?: string
        detailedLogging?: boolean
    }) {
        this.name = config.name
        this.tokensPerMillisecond =
            config.tokensAllocatedPerPeriod / (config.periodInSeconds * 1000)
        this.maxTokens = config.tokensAllocatedPerPeriod
        this.tokens = this.maxTokens
        this.lastRefill = Date.now()
        this.detailedLogging = config.detailedLogging
    }

    private refillTokens() {
        const now = Date.now()
        const elapsedTime = now - this.lastRefill
        const tokensToAdd = elapsedTime * this.tokensPerMillisecond
        this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd)
        this.lastRefill = now
    }

    private async wait(ms: number): Promise<void> {
        if (this.detailedLogging) {
            logger.log(`[${this.name}] Waiting for ${ms}ms`)
        }
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
