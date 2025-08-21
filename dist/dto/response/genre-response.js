"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toGenreResponse = toGenreResponse;
exports.toGenreResponses = toGenreResponses;
const response_error_1 = require("../../error/response-error");
const mappers_1 = require("../../helpers/mappers");
function toGenreResponse(genre) {
    if (genre == null)
        throw new response_error_1.ResponseError(500, "bookmark_error, something error from database");
    return (0, mappers_1.removeNulls)({
        id: genre.id,
        title: genre.title,
        slug: genre.slug,
        comics: genre.comics
    });
}
function toGenreResponses(genres) {
    return genres.map((comic) => toGenreResponse(comic));
}
