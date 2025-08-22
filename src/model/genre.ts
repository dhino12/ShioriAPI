import { ComicProperties } from "./comic";

export type GenreProperties = {
    id?:string;
    name?:string;
    slug?:string;
    comics?: ComicProperties[]
}

export class GenreModel {
    id;
    name;
    slug;
    comics
    constructor(props: Partial<GenreProperties> = {}) {
        this.id = props.id;
        this.name = props.name;
        this.slug = props.slug;
        this.comics = props.comics
    }
}