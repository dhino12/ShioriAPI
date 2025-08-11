import { BookmarkCreateRequest } from "../../dto/request/bookmark-request";
import { BookmarkResponse } from "../../dto/response/bookmark-response";

export interface IBookmarkService {
    create(bookmark: BookmarkCreateRequest): Promise<BookmarkResponse>
    delete(bookmarkId: string): Promise<null>
    findById(bookmarkId: string): Promise<BookmarkResponse>
    findAllByUserId(userId: string): Promise<BookmarkResponse[]>
}