import AppError from "./appError.errorHandler";

export function handleError(error: unknown, message: string, statusCode: number): never {
    if (error instanceof Error) {
        throw new AppError(`${message}: ${error.message}`, statusCode);
    }
    throw new AppError(message, statusCode);
}