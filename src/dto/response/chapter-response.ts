import { ResponseError } from "../../error/response-error";
import { removeNulls } from "../../helpers/mappers";
import { ChapterModel } from "../../model/chapters";
import { EpisodeResponse } from "./episode-response";
import { PaginationResponse } from "./pagination-response";

export type ChapterResponse = {
    id: string,
    title: string,
    slug: string,
    link: string,
    episodes: EpisodeResponse[]
    number_chapter: string,
    thumbnail_url: string,
    published_at: string,
    pagination: PaginationResponse,
    created_at: string,
    updated_at: string,
};

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

export function toChapterResponse(chapter: ChapterModel | null): ChapterResponse {
    if (chapter == null) throw new ResponseError(500,"bookmark_error, something error from database");
    return removeNulls({
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
    }) as ChapterResponse;
}

export function toChapterResponses(chapters: ChapterResponse[]): ChapterResponse[] {
    return chapters.map((chapter) => toChapterResponse(chapter));
}
