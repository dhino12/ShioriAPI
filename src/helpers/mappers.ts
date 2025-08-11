import { ResponseError } from "../error/response-error";
import { BookmarkModel } from "../model/bookmark";
import { UserModel } from "../model/user";

export const toUserModel = (data: any): UserModel => {
    return new UserModel(
        data.id,
        data.email,
        data.password,
        data.created_at,
        data.access_token,
        data.refresh_token,
        data.name ?? "",
        data.updated_at ?? null
    );
};

export const toBookmarkModel = (data: any): BookmarkModel|null => {
    if (data == null) return null
    return new BookmarkModel(
        data.id,
        data.user_id,
        data.comic_id,
        data.created_at,
        data.comic ?? {}
    );
};

export function removeNulls<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v != null) // filter null & undefined
    ) as Partial<T>;
}