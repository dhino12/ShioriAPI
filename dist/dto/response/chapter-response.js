"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toChapterResponse = toChapterResponse;
exports.toChapterResponses = toChapterResponses;
const response_error_1 = require("../../error/response-error");
const mappers_1 = require("../../helpers/mappers");
// export function toComicResponseDetail(comic: ComicModel | null): ComicResponse {
//     if (comic == null) throw new ResponseError(500,"bookmark_error, something error from database");
//     return removeNulls({
//         id: comic.id,
//         title: comic.title,
//         title_alternative: comic.title_alternative,
//         slug: comic.slug,
//         description: comic.description,
//         chapters: comic.chapters,
//         type: comic.type,
//         thumbnail_url: comic.thumbnail_url,
//         status: comic.status,
//         artist: comic.artist,
//         author: comic.author,
//         followedCount: comic.followedCount,
//         genres: comic.genres,
//         rating: comic.rating,
//         views: comic.views,
//         created_at: comic.created_at,
//         updated_at: comic.updated_at,
//     }) as ComicResponse;
// }
function toChapterResponse(chapter) {
    if (chapter == null)
        throw new response_error_1.ResponseError(500, "bookmark_error, something error from database");
    return (0, mappers_1.removeNulls)({
        id: chapter.id,
        title: chapter.title,
        slug: chapter.slug,
        link: chapter.link,
        number_chapter: chapter.number_chapter,
        published_at: chapter.published_at,
        thumbnail_url: chapter.thumbnail_url,
        episodes: chapter.episodes,
        pagination: chapter.pagination,
        created_at: chapter.created_at,
        updated_at: chapter.updated_at
    });
}
function toChapterResponses(chapters) {
    return chapters.map((chapter) => toChapterResponse(chapter));
}
