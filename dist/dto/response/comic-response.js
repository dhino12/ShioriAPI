"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toComicResponseDetail = toComicResponseDetail;
exports.toComicResponse = toComicResponse;
exports.toComicResponses = toComicResponses;
const response_error_1 = require("../../error/response-error");
const mappers_1 = require("../../helpers/mappers");
function toComicResponseDetail(comic) {
    if (comic == null)
        throw new response_error_1.ResponseError(500, "bookmark_error, something error from database");
    return (0, mappers_1.removeNulls)({
        id: comic.id,
        title: comic.title,
        title_alternative: comic.title_alternative,
        slug: comic.slug,
        description: comic.description,
        chapters: comic.chapters,
        type: comic.type,
        thumbnail_url: comic.thumbnail_url,
        status: comic.status,
        artist: comic.artist,
        author: comic.author,
        followedCount: comic.followedCount,
        genres: comic.genres,
        rating: comic.rating,
        views: comic.views,
        related_comic: comic.related_comic,
        created_at: comic.created_at,
        updated_at: comic.updated_at,
    });
}
function toComicResponse(comic) {
    if (comic == null)
        throw new response_error_1.ResponseError(500, "bookmark_error, something error from database");
    return (0, mappers_1.removeNulls)({
        id: comic.id,
        title: comic.title,
        title_alternative: comic.title_alternative,
        slug: comic.slug,
        chapters: comic.chapters,
        type: comic.type,
        thumbnail_url: comic.thumbnail_url,
        status: comic.status,
        genres: comic.genres,
        rating: comic.rating,
        updated_at: comic.updated_at,
    });
}
function toComicResponses(comics) {
    return comics.map((comic) => toComicResponse(comic));
}
