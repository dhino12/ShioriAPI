"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const zod_1 = require("zod");
const response_error_1 = require("../error/response-error");
const logging_1 = require("../app/logging");
const errorMiddleware = (error, request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (error instanceof zod_1.ZodError) {
        response.status(400).json({
            errors: `Validation Error: ${error.issues.map(issue => issue.message).join(", ")}`
        });
    }
    else if (error instanceof response_error_1.ResponseError) {
        logging_1.logger.warn(error.message);
        response.status(error.status).json({
            errors: error.message
        });
    }
    else {
        logging_1.logger.error(error.message);
        console.log(error, " <=============== ERROR 500");
        response.status(500).json({
            errors: error.message
        });
    }
});
exports.errorMiddleware = errorMiddleware;
