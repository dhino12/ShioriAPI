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
exports.BookmarkController = void 0;
const response_error_1 = require("../../error/response-error");
class BookmarkController {
    constructor(service) {
        this.service = service;
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const result = yield this.service.create(request);
                res.status(201).json({
                    code: 201,
                    status: "success",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params["id"];
                yield this.service.delete(id);
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
    findById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params["id"];
                const result = yield this.service.findById(id);
                res.status(200).json({
                    code: 200,
                    status: "success",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    findAllByUserId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                throw new response_error_1.ResponseError(401, "unauthorized");
            try {
                const results = yield this.service.findAllByUserId(req.user.id);
                res.status(200).json({
                    code: 200,
                    status: "success",
                    data: results
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.BookmarkController = BookmarkController;
