import { logger } from "../src/app/logging"
import web from "../src/app/router"
import supertest from "supertest"

describe('GET /comics/latest', () => {
    it("should able to get all comic latest if request domain valid", async() => {
        const response = await supertest(web)
            .get("/api/v1/comics/kiryuu/latest?pages=1")
        logger.debug(response.body, null, 2)
        expect(response.status).toBe(200)
    })
    it("should able to get comic by slug if request domain valid", async() => {
        const response = await supertest(web)
            .get("/api/v1/comics/kiryuu/isekai-meikyuu-no-saishinbu-o-mezasou/")
        logger.debug(response.body, null, 2)
        expect(response.status).toBe(200)
    })
})