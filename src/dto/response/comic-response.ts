import { ResponseError } from "../../error/response-error"
import { removeNulls } from "../../helpers/mappers"
import { ComicModel } from "../../model/comic"

export type ComicResponse = {
    id: string,
    title: string,
    description: string,
    type: string,
    thumbnail_url: string,
    status: string,
    created_at: string,
    updated_at: string,
}

export function toComicResponse(comic:ComicModel|null): ComicResponse {
    if (comic == null) throw new ResponseError(500, "bookmark_error, something error from database")
    return removeNulls({
        id: comic.id,
        title: comic.title,
        description: comic.description,
        type: comic.type,
        thumbnail_url: comic.thumbnail_url,
        status: comic.status,
        created_at: comic.created_at
    }) as ComicResponse
}

export function toComicResponses(comics:ComicModel[]): ComicResponse[] {
    return comics.map(comic => toComicResponse(comic))
}