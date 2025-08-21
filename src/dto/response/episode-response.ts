import { ResponseError } from "../../error/response-error";
import { removeNulls } from "../../helpers/mappers";
import { EpisodeModel } from "../../model/episode";

export type EpisodeResponse = {
    id: string,
    title: string,
    slug: string,
    link: string,
    page_number: string,
    image_url: string,
}

export function toEpisodeResponse(episode: EpisodeModel | null): EpisodeResponse {
    if (episode == null) throw new ResponseError(500,"bookmark_error, something error from database");
    return removeNulls({
        id: episode.id,
        title: episode.title,
        slug: episode.slug,
        link: episode.link,
        page_number: episode.page_number,
        image_url: episode.image_url,
    }) as EpisodeResponse;
}

export function toEpisodeResponses(episodes: EpisodeModel[]): EpisodeResponse[] {
    return episodes.map((comic) => toEpisodeResponse(comic));
}
