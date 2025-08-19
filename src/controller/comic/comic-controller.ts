import { NextFunction, Response, Request } from "express";
import { IComicService } from "../../service/comic/icomic-service";
import { IComicController } from "./icomic-controller";
import { IComicScraper } from "../../repository/scraper/comic/icomic-scraper";
import { getScraper } from "../../repository/scraper/comic/factory-scraper";

export class ComicController implements IComicController {
    constructor(private readonly service: IComicService) {}
    async findBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {domain, slug} = req.params;
        const comic = await this.service.findBySlug(domain, slug);
        res.status(200).json({
            code: 200,
            status: "success",
            data: comic
        })
    }
    async findAllLatest(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {domain} = req.params
        const {pages = 1} = req.query
        const comics = await this.service.findAllLatest(domain, pages.toString())
        
        res.status(200).json({
            code: 200,
            status: "success",
            data: comics
        })
    }
}