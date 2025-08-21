import { JSDOM } from "jsdom";
import * as cheerio from "cheerio";

export function parseHTML(html:string): Document {
    const dom = new JSDOM(html);
    return dom.window.document
}

export function parseHTMLCheerIO(html:string): cheerio.CheerioAPI {
    const dom = cheerio.load(html);
    return dom
}