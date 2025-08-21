import { ComicProperties } from "./comic";

export type GenreProperties = {
    id?:string;
    title?:string;
    slug?:string;
    comics?: ComicProperties[]
}

export class GenreModel {
    id;
    title;
    slug;
    comics
    constructor(props: Partial<GenreProperties> = {}) {
        this.id = props.id;
        this.title = props.title;
        this.slug = props.slug;
        this.comics = props.comics
    }
}