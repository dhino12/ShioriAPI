import { logger } from "../src/app/logging"
import web from "../src/app/router"
import supertest from "supertest"

describe('GET /comics/latest', () => {
    // it("should able to get all comic latest if request domain valid", async() => {
    //     const response = await supertest(web)
    //         .get("/api/v1/kiryuu/comics/latest?pages=1")
    //     logger.debug(response.body, null, 2)
    //     expect(response.status).toBe(200)
    // })

    // it("should able to get comic by slug if request domain valid", async() => {
    //     const response = await supertest(web)
    //         .get("/api/v1/kiryuu/comics/nade-nade-skill-de-maryoku-chuunyuu/")
    //     logger.debug(response.body, null, 2)
    //     expect(response.status).toBe(200)
    // })

    // it("should able to get genres if request domain valid", async() => {
    //     const response = await supertest(web)
    //         .get("/api/v1/kiryuu/genres")
    //     logger.debug(response.body, null, 2)
    //     expect(response.status).toBe(200)
    // })

    // it("should able to get genres if request domain valid", async() => {
    //     const response = await supertest(web)
    //         .get("/api/v1/kiryuu/genres/action/comics")
    //     logger.debug(response.body, null, 2)
    //     expect(response.status).toBe(200)
    // })
    // it("should able to get all comics if request domain valid", async() => {
    //     const response = await supertest(web)
    //         .get("/api/v1/kiryuu/comics")
    //     logger.debug(response.body, null, 2)
    //     expect(response.status).toBe(200)
    // })
    // it("should able to get all comics by filter if request domain valid", async() => {
    //     const response = await supertest(web)
    //         .get("/api/v1/kiryuu/comics?genreids[]=2&genreids[]=4")
    //     logger.debug(response.body, null, 2)
    //     expect(response.status).toBe(200)
    // })
    // it("should able to get all chapters by comic slug if request domain valid", async() => {
    //     const response = await supertest(web)
    //         .get("/api/v1/kiryuu/comics/isekai-meikyuu-no-saishinbu-o-mezasou/chapters")
    //     logger.debug(response.body, null, 2)
    //     expect(response.status).toBe(200)
    // })
    it("should able to get chapters by chapter slug if request domain valid", async() => {
        const response = await supertest(web)
            .get("/api/v1/kiryuu/comics/honyaku-no-sainou-de-ore-dake-ga-sekai-wo-kaihen-dekiru-ken/chapters/honyaku-no-sainou-de-ore-dake-ga-sekai-wo-kaihen-dekiru-ken-chapter-26-3/")
        logger.debug(response.body, null, 2)
        expect(response.status).toBe(200)
    })
    // it("should able to get all episodes by chapter slug if request domain valid", async() => {
    //     const response = await supertest(web)
    //         .get("/api/v1/kiryuu/comics/honyaku-no-sainou-de-ore-dake-ga-sekai-wo-kaihen-dekiru-ken/chapters/honyaku-no-sainou-de-ore-dake-ga-sekai-wo-kaihen-dekiru-ken-chapter-26-3")
    //     logger.debug(response.body, null, 2)
    //     expect(response.status).toBe(200)
    // })
    // it("should able to get all comics by text only if request domain valid", async() => {
    //     const response = await supertest(web)
    //         .get("/api/v1/kiryuu/comics/list-mode?pages=a")
    //     logger.debug(response.body.data[0], null, 2)
    //     expect(response.status).toBe(200)
    // }, 50000)
})