import { ResponseError } from "../../error/response-error"
import { removeNulls } from "../../helpers/mappers"
import { BookmarkModel } from "../../model/bookmark"
import { ComicResponse } from "./comic-response"

export type BookmarkResponse = {
    id: string,
    user_id: string,
    comic_id: string,
    created_at: Date,
    comic?: ComicResponse
}

export function toBookmarkResponse(bookmark:BookmarkModel|null): BookmarkResponse {
    if (bookmark == null) throw new ResponseError(500, "bookmark_error, something error from database")
    return removeNulls({
        id: bookmark.id,
        user_id: bookmark.user_id,
        comic_id: bookmark.comic_id,
        comic: bookmark.comic ?? null
    }) as BookmarkResponse
}

export function toBookmarkResponses(bookmarks:BookmarkModel[]): BookmarkResponse[] {
    return bookmarks.map(bookmark => toBookmarkResponse(bookmark))
}