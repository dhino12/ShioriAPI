export type ComicProperties = {
    id?: string;
    type?: string;
    title?: string;
    description?: string;
    slug?: string;
    thumbnail_url?: string;
    status?: string;
    genres?: [];
    chapters?: [],
    created_at?: string;
    updated_at?: string;
};

export class ComicModel {
    id;
    type;
    title;
    description;
    thumbnail_url;
    status;
    genres;
    slug;
    chapters;
    created_at;
    updated_at;
    constructor(props: Partial<ComicProperties> = {}) {
        this.id = props.id ?? "";
        this.type = props.type ?? "";
        this.title = props.title ?? "";
        this.slug = props.slug ?? "";
        this.description = props.description ?? "";
        this.thumbnail_url = props.thumbnail_url ?? "";
        this.status = props.status ?? "";
        this.genres = props.genres;
        this.chapters = props.chapters;
        this.created_at = props.created_at ?? "";
        this.updated_at = props.updated_at ?? "";
    }
}