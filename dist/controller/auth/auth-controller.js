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
exports.AuthController = void 0;
const mappers_1 = require("../../helpers/mappers");
const response_error_1 = require("../../error/response-error");
class AuthController {
    constructor(service) {
        this.service = service;
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const auth = yield this.service.register(request);
                res.status(201).json({
                    code: 201,
                    status: "success",
                    data: auth
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const auth = yield this.service.login(request);
                res.cookie("refresh_token", auth.refresh_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 hari
                });
                auth.refresh_token = null;
                res.status(200).json({
                    code: 200,
                    status: "success",
                    data: (0, mappers_1.removeNulls)(auth)
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                throw new response_error_1.ResponseError(401, "unauthorized");
            try {
                yield this.service.logout(req.user.id);
                res.clearCookie("refresh_token", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                });
                res.status(200).json({
                    code: 200,
                    status: "success",
                    data: {}
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token;
            if (!refreshToken)
                throw new response_error_1.ResponseError(401, "unauthorized");
            try {
                const resultRefreshToken = yield this.service.refreshToken(refreshToken);
                // Hapus cookie refresh_token
                res.clearCookie("refresh_token");
                res.cookie("refresh_token", resultRefreshToken.refresh_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 hari
                });
                resultRefreshToken.refresh_token = null;
                res.status(200).json({
                    code: 200,
                    status: "success",
                    data: (0, mappers_1.removeNulls)(resultRefreshToken)
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AuthController = AuthController;
