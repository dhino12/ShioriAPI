import { ChapterResponse } from "./chapter-response";

export type RelatedComicResponse = {
    id?: string;
    type?: string;
    title?: string;
    slug?: string;
    thumbnail_url?: string;
    rating?: string;
    status?: string;
    chapters?: ChapterResponse[],
    created_at?: string;
    updated_at?: string;
}