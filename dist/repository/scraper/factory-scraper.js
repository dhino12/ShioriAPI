"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScraper = getScraper;
const response_error_1 = require("../../error/response-error");
const kiryuu_scraper_1 = require("./strategies/kiryuu-scraper");
function getScraper(domain) {
    switch (true) {
        case domain.includes("kiryuu"):
            return new kiryuu_scraper_1.KiryuuScraper();
        default:
            throw new response_error_1.ResponseError(404, "No scraper available for this domain");
    }
}
