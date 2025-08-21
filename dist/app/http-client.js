"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpClient = void 0;
const axios_1 = __importDefault(require("axios"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
exports.httpClient = axios_1.default.create({
    timeout: 10000,
    headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MyScraper/1.0)",
        "Accept-Language": "en-US,en;q=0.9",
    },
    httpAgent: new http_1.default.Agent({ keepAlive: false }),
    httpsAgent: new https_1.default.Agent({ keepAlive: false }),
});
