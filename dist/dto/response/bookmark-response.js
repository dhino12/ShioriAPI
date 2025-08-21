"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBookmarkResponse = toBookmarkResponse;
exports.toBookmarkResponses = toBookmarkResponses;
const response_error_1 = require("../../error/response-error");
const mappers_1 = require("../../helpers/mappers");
function toBookmarkResponse(bookmark) {
    var _a;
    if (bookmark == null)
        throw new response_error_1.ResponseError(500, "bookmark_error, something error from database");
    return (0, mappers_1.removeNulls)({
        id: bookmark.id,
        user_id: bookmark.user_id,
        comic_id: bookmark.comic_id,
        comic: (_a = bookmark.comic) !== null && _a !== void 0 ? _a : null
    });
}
function toBookmarkResponses(bookmarks) {
    return bookmarks.map(bookmark => toBookmarkResponse(bookmark));
}
