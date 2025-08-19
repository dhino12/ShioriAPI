import { ResponseError } from "../error/response-error";
import { BookmarkModel } from "../model/bookmark";
import { ComicModel, ComicProperties } from "../model/comic";
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

export const toComicModel = (dataScraper: {data: ComicProperties}): ComicModel|null => {
    if (dataScraper == null) return null
    const {data} = dataScraper
    const dataComicModel = new ComicModel({
        id: data.id ?? "",
        type: data.type ?? "",
        slug: data.slug ?? "",
        title: data.title ?? "",
        title_alternative: data.title_alternative ?? "",
        description: data.description ?? "",
        thumbnail_url: data.thumbnail_url ?? "",
        status: data.status ?? "",
        rating: data.rating ?? "",
        author: data.author ?? "",
        artist: data.artist ?? "",
        views: data.views ?? "",
        followedCount: data.followedCount ?? "",
        genres: data.genres,
        chapters: data.chapters,
        three_new_chapters: data.chapters,
        created_at: data.created_at ?? "",
        updated_at: data.updated_at ?? "",
    } as ComicProperties)
    
    return dataComicModel
}

export function removeNulls<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v != null || v == "") // filter null & undefined
    ) as Partial<T>;
}