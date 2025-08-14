export type ComicProperties = {
    id: string, type: string, 
    title: string, description: string, 
    thumbnail_url: string, status: string, 
    genres: [], created_at: string
}

export class ComicModel {
    id
    type
    title
    description
    thumbnail_url
    status
    genres
    created_at
    constructor(props: Partial<ComicProperties> = {}) {
        this.id = props.id ?? ""
        this.type = props.type ?? ""
        this.title = props.title ?? ""
        this.description = props.description ?? ""
        this.thumbnail_url = props.thumbnail_url ?? ""
        this.status = props.status ?? ""
        this.genres = props.genres
        this.created_at = props.created_at ?? ""
    }
}