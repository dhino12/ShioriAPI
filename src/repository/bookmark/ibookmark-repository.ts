import { BookmarkModel } from "../../model/bookmark";

export interface IBookmarkRepository {
    create(bookmark: BookmarkModel): Promise<BookmarkModel|null>
    delete(bookmarkId: string): Promise<null>
    findById(userId: string): Promise<BookmarkModel|null>
    findAllByUserId(userId: string): Promise<BookmarkModel[]>
}