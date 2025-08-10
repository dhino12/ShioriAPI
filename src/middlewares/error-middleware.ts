import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/response-error";
import { logger } from "../app/logging";

export const errorMiddleware = async (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof ZodError) {
        response.status(400).json({
            errors: `Validation Error: ${error.issues.map(issue => issue.message).join(", ")}`
        });
    } else if (error instanceof ResponseError) {
        logger.warn(error.message)
        response.status(error.status).json({
            errors: error.message
        });
    } else {
        logger.error(error.message)
        console.log(error, " <=============== ERROR 500");
        response.status(500).json({
            errors: error.message
        });
    }
}