"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.AuthService = void 0;
const auth_response_1 = require("../../dto/response/auth-response");
const mappers_1 = require("../../helpers/mappers");
const auth_schema_1 = require("../../validation/auth-schema");
const validation_1 = require("../../validation/validation");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const response_error_1 = require("../../error/response-error");
const jwt_helper_1 = require("../../helpers/jwt-helper");
class AuthService {
    constructor(repo) {
        this.repo = repo;
    }
    register(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(auth_schema_1.AuthSchemaValidation.REGISTER, user);
            createRequest.password = yield bcrypt.hash(createRequest.password, 10);
            const result = yield this.repo.create((0, mappers_1.toUserModel)(createRequest));
            return (0, auth_response_1.toAuthResponse)(result);
        });
    }
    login(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginRequest = validation_1.Validation.validate(auth_schema_1.AuthSchemaValidation.LOGIN, user);
            const findEmail = yield this.repo.findByEmail(loginRequest.email);
            if (!findEmail)
                throw new response_error_1.ResponseError(400, "email/password wrong");
            const ok = yield bcrypt.compare(loginRequest.password, findEmail.password);
            if (!ok)
                throw new response_error_1.ResponseError(400, "email/password wrong");
            const accessToken = (0, jwt_helper_1.signAccess)({ sub: findEmail.id, email: findEmail.email, id: findEmail.id });
            const refreshToken = (0, jwt_helper_1.signRefresh)({ sub: findEmail.id });
            const hashed = this.hashToken(refreshToken);
            yield this.repo.updateRefreshToken(findEmail.id, hashed);
            findEmail.access_token = accessToken;
            findEmail.refresh_token = refreshToken;
            return (0, auth_response_1.toAuthResponse)(findEmail);
        });
    }
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = (0, jwt_helper_1.verifyRefresh)(refreshToken);
            const userId = payload.sub;
            const user = yield this.repo.findById(userId);
            if (!user)
                throw new response_error_1.ResponseError(400, "Invalid Token");
            if (!user.refresh_token)
                throw new response_error_1.ResponseError(404, "refresh_token not found");
            if (!this.compareHashed(refreshToken, user.refresh_token)) {
                yield this.repo.updateRefreshToken(userId, null);
                throw new response_error_1.ResponseError(400, "Invalid refresh_token");
            }
            // Issue new tokens (rotation)
            const newAccess = (0, jwt_helper_1.signAccess)({ sub: user.id, email: user.email });
            const newRefresh = (0, jwt_helper_1.signRefresh)({ sub: user.id });
            const newHashed = this.hashToken(newRefresh);
            yield this.repo.updateRefreshToken(userId, newHashed);
            user.access_token = newAccess;
            // res.cookie("refresh_token", refreshToken, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === "production",
            //     sameSite: "strict",
            //     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            // })
            user.refresh_token = refreshToken;
            return (0, auth_response_1.toAuthResponse)(user);
        });
    }
    logout(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.updateRefreshToken(userId, null);
        });
    }
    hashToken(token) {
        // faster: use sha256; or bcrypt for extra cost
        return crypto.createHash("sha256").update(token).digest("hex");
    }
    compareHashed(token, hashed) {
        return this.hashToken(token) === hashed;
    }
}
exports.AuthService = AuthService;
