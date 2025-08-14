import { logger } from "../src/app/logging"
import web from "../src/app/router"
import supertest from "supertest"

describe('GET /comics/latest', () => { 
    it("should able to get bookmark if request domain valid", async() => {
        const response = await supertest(web)
            .get("/api/v1/comics/kiryuu/latest")
        logger.debug(response.body, null, 2)
        expect(response.status).toBe(200)
    })
})