import jest from 'jest'
import axios from "axios";
import http from "http";
import https from "https";

export const httpClient = axios.create({
    timeout: 10000,
    headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MyScraper/1.0)",
        "Accept-Language": "en-US,en;q=0.9",
    },
    httpAgent: new http.Agent({ keepAlive: false }),
    httpsAgent: new https.Agent({ keepAlive: false }),
});