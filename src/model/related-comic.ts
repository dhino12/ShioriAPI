import { ChapterProperties } from "./chapters";

export type RelatedComicProperties = {
    id?: string;
    type?: string;
    title?: string;
    slug?: string;
    thumbnail_url?: string;
    rating?: string;
    status?: string;
    chapters?: ChapterProperties[],
    created_at?: string;
    updated_at?: string;
}