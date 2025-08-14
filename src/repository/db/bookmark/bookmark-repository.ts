import { prismaClient } from "../../../app/database";
import { toBookmarkModel } from "../../../helpers/mappers";
import { BookmarkModel } from "../../../model/bookmark";
import { IBookmarkRepository } from "./ibookmark-repository";

export class BookmarkRepository implements IBookmarkRepository {
    async create(bookmark: BookmarkModel): Promise<BookmarkModel | null> {
        bookmark.setId();
        const data = await prismaClient.bookmark.create({
            data: {
                id: bookmark.id,
                user_id: bookmark.user_id,
                comic_id: bookmark.comic_id,
            },
        });
        return toBookmarkModel(data);
    }
    async delete(bookmarkId: string): Promise<null> {
        const data = await prismaClient.bookmark.delete({
            where: {
                id: bookmarkId,
            },
        });
        return null;
    }
    async findById(userId: string): Promise<BookmarkModel | null> {
        const data = await prismaClient.bookmark.findFirst({
            where: {
                id: userId,
            },
        });
        return toBookmarkModel(data);
    }
    async findAllByUserId(userId: string): Promise<BookmarkModel[]> {
        const datas = await prismaClient.bookmark.findMany({
            where: {
                user_id: userId,
            },
        });
        return datas
            .map((data) => toBookmarkModel(data))
            .filter((bookmark): bookmark is BookmarkModel => bookmark !== null);
    }
}
