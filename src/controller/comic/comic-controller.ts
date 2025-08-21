import { NextFunction, Response, Request } from "express";
import { IComicController } from "./icomic-controller";
import { IComicScraper } from "../../repository/scraper/icomic-scraper";
import { getScraper } from "../../repository/scraper/factory-scraper";
import { IScraperService } from "../../service/scraper/iscraper-service";

export class ComicController implements IComicController {
    constructor(private readonly service: IScraperService) {}
    async findTextListComics(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { domain } = req.params
        const {pages = "1"} = req.query
        const episodes = await this.service.findTextListComics(domain, pages.toString());
        res.status(200).json({
            code: 200,
            status: "success",
            data: episodes,
        });
    }
    async findEpisodesByChapterSlug(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { domain, slugchapter } = req.params
        const episodes = await this.service.findEpisodesByChapterSlug(domain, slugchapter);
        res.status(200).json({
            code: 200,
            status: "success",
            data: episodes,
        });
    }
    async findChapterBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { domain, slugchapter } = req.params
        const chapters = await this.service.findChapterBySlug(domain, slugchapter);
        res.status(200).json({
            code: 200,
            status: "success",
            data: chapters,
        });
    }
    async findChaptersByComicSlug(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { domain, slug } = req.params
        const chapters = await this.service.findChapterByComicSlug(domain, slug);
        res.status(200).json({
            code: 200,
            status: "success",
            data: chapters,
        });
    }
    async findComics(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { domain } = req.params
        const {
            order = "",
            status = "ongoing", 
            pages = "1",
            type = "",
        } = req.query
        const genreids = req.query["genreids[]"]
        const genreIds: string[] = Array.isArray(genreids) ? genreids.map(String) : genreids? [String(genreids)] : [];
        const comics = await this.service.findComics(domain, genreIds, `${status}`, `${type}`, `${order}`, `${pages}`)
        res.status(200).json({
            code: 200,
            status: "succes",
            data: comics
        })
    }
    async findBySlug(req: Request,res: Response,next: NextFunction): Promise<void> {
        const { domain, slug } = req.params;
        const comic = await this.service.findBySlug(domain, slug);
        res.status(200).json({
            code: 200,
            status: "success",
            data: comic,
        });
    }
    async findAllLatest(req: Request,res: Response,next: NextFunction): Promise<void> {
        const { domain } = req.params;
        const { pages = 1 } = req.query;
        const comics = await this.service.findAllLatest(domain,pages.toString());

        res.status(200).json({
            code: 200,
            status: "success",
            data: comics,
        });
    }
    async findComicsByGenreSlug(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {domain, slug} = req.params
        const {pages = 1} = req.query
        const genre = await this.service.findComicsByGenreSlug(domain, slug, pages.toString())
        res.status(200).json({
            code: 200,
            status: "success",
            data: genre
        })
    }
    async findAllGenres(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {domain} = req.params
        const genres = await this.service.findAllGenre(domain)
        res.status(200).json({
            code: 200,
            status: "success",
            data: genres
        })
    }
}
