"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtAuthMiddleware = jwtAuthMiddleware;
const jwt_helper_1 = require("../helpers/jwt-helper");
const response_error_1 = require("../error/response-error");
function jwtAuthMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log(authHeader, " <=======");
    if (!authHeader)
        throw new response_error_1.ResponseError(401, "unauthorized");
    const token = authHeader.split(" ")[1];
    try {
        if (!token || token == "") {
            throw new response_error_1.ResponseError(401, "unauthorized");
        }
        const payload = (0, jwt_helper_1.verifyAccess)(token);
        req.user = {
            id: payload.id,
            email: payload.email
        };
        next();
    }
    catch (error) {
        next(new response_error_1.ResponseError(401, "unauthorized"));
    }
}
