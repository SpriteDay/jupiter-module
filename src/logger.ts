import { ZodError } from "zod"

export const logger = console

interface FormattedZodError {
    path: string
    message: string
}

function formatZodError(error: ZodError): FormattedZodError[] {
    return error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
    }))
}

export function logZodErrors(error: ZodError, originalData?: unknown): void {
    const formattedErrors = formatZodError(error)

    logger.groupCollapsed(
        "%c❌ Jupiter Module: Zod Validation Errors:",
        "color: red; font-weight: bold;",
    )
    formattedErrors.forEach((err) => {
        logger.log(
            `%c🔸 Path: %c${err.path || "root"}\n   %cMessage: %c${err.message}`,
            "color: orange; font-weight: bold;", // Path label
            "color: white;", // Path value
            "color: cyan; font-weight: bold;", // Message label
            "color: white;", // Message value
        )
    })

    if (originalData) {
        logger.groupCollapsed(
            "%c📂 Original Data (click to expand)",
            "color: gray; font-style: italic;",
        )
        logger.dir(originalData)
        logger.groupEnd()
    }

    logger.groupEnd()
}
