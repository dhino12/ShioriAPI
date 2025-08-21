import { EpisodeProperties } from "./episode";
import { PaginationProperties } from "./pagination";

export type ChapterSimple = {
    title: string,
    slug: string,
    link: string,
    created_at: string
}

export type ChapterProperties = {
    id: string,
    title: string,
    slug: string,
    link: string,
    episodes?:EpisodeProperties[]
    number_chapter: string,
    thumbnail_url: string,
    published_at: string,
    pagination: PaginationProperties,
    created_at: string,
    updated_at: string,
}

export class ChapterModel {
    id;
    title;
    slug;
    link;
    episodes;
    number_chapter;
    thumbnail_url;
    published_at;
    pagination;
    created_at;
    updated_at;
    constructor(props: Partial<ChapterProperties> = {}) {
        this.id = props.id ?? "";
        this.title = props.title ?? "";
        this.slug = props.slug ?? "";
        this.link = props.link ?? "";
        this.episodes = props.episodes ?? []
        this.thumbnail_url = props.thumbnail_url ?? "";
        this.number_chapter = props.number_chapter ?? "";
        this.published_at = props.published_at ?? "";
        this.pagination = props.pagination ?? { next: "", prev: "" };
        this.created_at = props.created_at ?? "";
        this.updated_at = props.updated_at ?? "";
    }
}