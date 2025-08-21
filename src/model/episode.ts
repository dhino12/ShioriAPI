export type EpisodeProperties = {
    id: string,
    title: string,
    slug: string,
    link: string,
    page_number: string,
    image_url: string,
}

export class EpisodeModel {
    id;
    title;
    slug;
    link;
    page_number;
    image_url;
    constructor(props: Partial<EpisodeProperties> = {}) {
        this.id = props.id ?? "";
        this.title = props.title ?? "";
        this.slug = props.slug ?? "";
        this.link = props.link ?? "";
        this.page_number = props.page_number ?? []
        this.image_url = props.image_url ?? "";
    }
}