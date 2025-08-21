"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toAuthResponse = toAuthResponse;
exports.toAuthResponses = toAuthResponses;
const response_error_1 = require("../../error/response-error");
const mappers_1 = require("../../helpers/mappers");
function toAuthResponse(user) {
    if (user == null)
        throw new response_error_1.ResponseError(500, "auth_error, something error from database");
    return (0, mappers_1.removeNulls)({
        id: user.id,
        email: user.email,
        created_at: user.createdAt,
        access_token: user.access_token,
        refresh_token: user.refresh_token
    });
}
function toAuthResponses(users) {
    const data = users.map(user => toAuthResponse(user));
    return data;
}
