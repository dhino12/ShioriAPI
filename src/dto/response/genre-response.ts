import { ResponseError } from "../../error/response-error";
import { removeNulls } from "../../helpers/mappers";
import { GenreModel } from "../../model/genre";
import { ComicResponse } from "./comic-response";

export type GenreResponse = {
    id: string;
    name: string;
    slug: string;
    comics: ComicResponse[];
}

export function toGenreResponse(genre: GenreModel | null): GenreResponse {
    if (genre == null) throw new ResponseError(500, "bookmark_error, something error from database");
    return removeNulls({
        id: genre.id,
        name: genre.name,
        slug: genre.slug,
        comics: genre.comics
    }) as GenreResponse;
}

export function toGenreResponses(genres: GenreModel[]): GenreResponse[] {
    return genres.map((comic) => toGenreResponse(comic));
}
