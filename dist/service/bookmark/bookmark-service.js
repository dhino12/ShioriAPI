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
exports.BookmarkService = void 0;
const bookmark_response_1 = require("../../dto/response/bookmark-response");
const response_error_1 = require("../../error/response-error");
const mappers_1 = require("../../helpers/mappers");
const bookmark_schema_1 = require("../../validation/bookmark-schema");
const validation_1 = require("../../validation/validation");
class BookmarkService {
    constructor(repository) {
        this.repository = repository;
    }
    create(bookmark) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookmarkRequest = validation_1.Validation.validate(bookmark_schema_1.BookmarkSchema.CREATE, bookmark);
            // TODO: CHECK ID COMIC
            // SKIP DULU
            // TODO: CHECK ID USER
            // SKIP DULU
            const data = yield this.repository.create((0, mappers_1.toBookmarkModel)(bookmarkRequest));
            return (0, bookmark_response_1.toBookmarkResponse)(data);
        });
    }
    delete(bookmarkId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookmark = yield this.repository.findById(bookmarkId);
            if (!bookmark)
                throw new response_error_1.ResponseError(404, "bookmark not found");
            yield this.repository.delete(bookmarkId);
            return null;
        });
    }
    findById(bookmarkId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookmark = yield this.repository.findById(bookmarkId);
            if (!bookmark)
                throw new response_error_1.ResponseError(404, "bookmark not found");
            return (0, bookmark_response_1.toBookmarkResponse)(bookmark);
        });
    }
    findAllByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookmarks = yield this.repository.findAllByUserId(userId);
            return (0, bookmark_response_1.toBookmarkResponses)(bookmarks);
        });
    }
}
exports.BookmarkService = BookmarkService;
