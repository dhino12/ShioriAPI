import {
    BookmarkCreateRequest,
    BookmarkUpdateRequest,
} from "../../dto/request/bookmark-request";
import {
    BookmarkResponse,
    toBookmarkResponse,
    toBookmarkResponses,
} from "../../dto/response/bookmark-response";
import { ResponseError } from "../../error/response-error";
import { toBookmarkModel } from "../../helpers/mappers";
import { IBookmarkRepository } from "../../repository/db/bookmark/ibookmark-repository";
import { BookmarkSchema } from "../../validation/bookmark-schema";
import { Validation } from "../../validation/validation";
import { IBookmarkService } from "./ibookmark-service";

export class BookmarkService implements IBookmarkService {
    constructor(private readonly repository: IBookmarkRepository) {}
    async create(bookmark: BookmarkCreateRequest): Promise<BookmarkResponse> {
        const bookmarkRequest = Validation.validate(BookmarkSchema.CREATE,bookmark) as BookmarkCreateRequest;
        // TODO: CHECK ID COMIC
        // SKIP DULU

        // TODO: CHECK ID USER
        // SKIP DULU
        const data = await this.repository.create(toBookmarkModel(bookmarkRequest)!);
        return toBookmarkResponse(data);
    }
    async delete(bookmarkId: string): Promise<null> {
        const bookmark = await this.repository.findById(bookmarkId);
        if (!bookmark) throw new ResponseError(404, "bookmark not found");

        await this.repository.delete(bookmarkId);
        return null;
    }
    async findById(bookmarkId: string): Promise<BookmarkResponse> {
        const bookmark = await this.repository.findById(bookmarkId);
        if (!bookmark) throw new ResponseError(404, "bookmark not found");
        return toBookmarkResponse(bookmark);
    }
    async findAllByUserId(userId: string): Promise<BookmarkResponse[]> {
        const bookmarks = await this.repository.findAllByUserId(userId);
        return toBookmarkResponses(bookmarks);
    }
}
