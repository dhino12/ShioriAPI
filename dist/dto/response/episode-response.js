"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEpisodeResponse = toEpisodeResponse;
exports.toEpisodeResponses = toEpisodeResponses;
const response_error_1 = require("../../error/response-error");
const mappers_1 = require("../../helpers/mappers");
function toEpisodeResponse(episode) {
    if (episode == null)
        throw new response_error_1.ResponseError(500, "bookmark_error, something error from database");
    return (0, mappers_1.removeNulls)({
        id: episode.id,
        title: episode.title,
        slug: episode.slug,
        link: episode.link,
        page_number: episode.page_number,
        image_url: episode.image_url,
    });
}
function toEpisodeResponses(episodes) {
    return episodes.map((comic) => toEpisodeResponse(comic));
}
