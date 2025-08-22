import { ChapterProperties, ChapterSimple } from "./chapters";
import { CreatorProperties } from "./creator";
import { GenreProperties } from "./genre";
import { RelatedComicProperties } from "./related-comic";

export type ComicProperties = {
    id?: string;
    type?: string;
    title?: string;
    title_alternative?: string;
    description?: string;
    slug?: string;
    thumbnail_url?: string;
    rating?: string;
    status?: string;
    views?: string;
    followedCount?: string;
    genres?: GenreProperties[];
    chapters?: ChapterProperties[];
    related_comic?:RelatedComicProperties[];
    creator?:CreatorProperties[];
    created_at?: string;
    updated_at?: string;
};

export type ComicSimpleProperties = {
    id?: string;
    type?: string;
    title?: string;
    slug?: string;
    thumbnail_url?: string;
    rating?: string;
    status?: string;
    genres?: GenreProperties[];
    chapters?: ChapterProperties[],
    created_at?: string;
    updated_at?: string;
};

export class ComicModel {
    id;
    type;
    title;
    title_alternative;
    description;
    thumbnail_url;
    status;
    genres;
    slug;
    rating;
    author;
    artist;
    views;
    followedCount;
    chapters;
    creators;
    related_comic;
    created_at;
    updated_at;
    constructor(props: Partial<ComicProperties> = {}) {
        this.id = props.id ?? "";
        this.type = props.type ?? "";
        this.title = props.title ?? "";
        this.title_alternative = props.title_alternative ?? "";
        this.slug = props.slug ?? "";
        this.description = props.description ?? "";
        this.thumbnail_url = props.thumbnail_url ?? "";
        this.status = props.status ?? "";
        this.genres = props.genres;
        this.chapters = props.chapters;
        this.rating = props.rating ?? "";
        this.creators = props.creator ?? []
        this.views = props.views ?? "";
        this.followedCount = props.followedCount ?? "";
        this.related_comic = props.related_comic ?? "";
        this.created_at = props.created_at ?? "";
        this.updated_at = props.updated_at ?? "";
    }
}