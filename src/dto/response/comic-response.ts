import { ResponseError } from "../../error/response-error";
import { removeNulls } from "../../helpers/mappers";
import { ComicModel } from "../../model/comic";

export type ComicResponse = {
    id: string;
    title: string;
    title_alternative: string;
    slug: string;
    description: string;
    type: string;
    thumbnail_url: string;
    status: string;
    chapters: [];
    rating?: string;
    artist?: string;
    author?: string;
    views?: string;
    followedCount?: string;
    genres?: [];
    created_at: string;
    updated_at: string;
};

export function toComicResponseDetail(comic: ComicModel | null): ComicResponse {
    if (comic == null) throw new ResponseError(500,"bookmark_error, something error from database");
    return removeNulls({
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
        created_at: comic.created_at,
        updated_at: comic.updated_at,
    }) as ComicResponse;
}

export function toComicResponse(comic: ComicModel | null): ComicResponse {
    if (comic == null)
        throw new ResponseError(500,"bookmark_error, something error from database");
    return removeNulls({
        id: comic.id,
        title: comic.title,
        slug: comic.slug,
        chapters: comic.chapters,
        type: comic.type,
        thumbnail_url: comic.thumbnail_url,
        status: comic.status,
        rating: comic.rating,
        updated_at: comic.updated_at,
    }) as ComicResponse;
}

export function toComicResponses(comics: ComicModel[]): ComicResponse[] {
    return comics.map((comic) => toComicResponse(comic));
}
