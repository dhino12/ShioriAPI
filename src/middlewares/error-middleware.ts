import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/response-error";
import { logger } from "../app/logging";

export const errorMiddleware = async (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof ZodError) {
        logger.error(error.message)
        response.status(400).json({
            code: 400,
            status: `Validation Error: ${error.issues.map(issue => issue.message).join(", ")}`,
            data: null
        });
    } else if (error instanceof ResponseError) {
        logger.error(error.message)
        response.status(error.status).json({
            code: error.status,
            status: error.message,
            data: null
        });
    } else {
        logger.error(error.message)
        response.status(500).json({
            code: 500,
            status: error.message,
            data: null
        });
    }
}