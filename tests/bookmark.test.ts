import supertest from "supertest"
import { BookmarkTest, UserTest } from "./test-util"
import web from "../src/app/router"
import { logger } from "../src/app/logging"
import {v4 as uuid} from 'uuid'
describe('POST /bookmark', () => { 
    beforeEach(async () => {
        await BookmarkTest.delete();
        await UserTest.delete()
        await UserTest.create()
        console.log("==== bookmark test ====");
        
    });
    afterEach(async () => {
        await BookmarkTest.delete();
        await UserTest.delete();
    })
    it("should reject new bookmark if request is invalid", async() => {
        const responseLogin = await supertest(web)
            .post("/api/v1/login")
            .send({
                email: "test@gmail.com",
                password: "test"
            })

        logger.debug(responseLogin)
        expect(responseLogin.status).toBe(200)

        const response = await supertest(web)
            .post("/api/v1/bookmark")
            .set("Authorization", `Bearer ${responseLogin.body.data.access_token}`)
            .send({
                user_id: "",
                comic_id: ""
            })

        logger.debug(response)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined();
    })
    
    it("should reject new bookmarks if unauthorized requests", async() => {
        const response = await supertest(web)
            .post("/api/v1/bookmark")
            .set("Authorization", ``)
            .send({
                user_id: "121",
                comic_id: "121"
            })

        logger.debug(response)
        expect(response.status).toBe(401)
        expect(response.body.errors).toBeDefined();
    })

    it("should able to new bookmark ", async() => {
        const responseLogin = await supertest(web)
            .post("/api/v1/login")
            .send({
                email: "test@gmail.com",
                password: "test"
            })

        logger.debug(responseLogin)
        expect(responseLogin.status).toBe(200)

        const response = await supertest(web)
            .post("/api/v1/bookmark")
            .set("Authorization", `Bearer ${responseLogin.body.data.access_token}`)
            .send({
                user_id: responseLogin.body.data.id,
                comic_id: uuid().substring(0,10)
            })

        logger.debug(response)
        expect(response.status).toBe(201)
        expect(response.body.status).toBe("success");
        expect(response.body.data.id).toBeDefined();
    })
})

describe('DELETE /bookmark/{id}', () => {
    beforeEach(async () => {
        await BookmarkTest.delete();
        await UserTest.delete()
        await UserTest.create()
        console.log("==== bookmark test ====");
    });
    afterEach(async () => {
        await BookmarkTest.delete();
        await UserTest.delete();
    })

    it("should reject delete bookmark if id is notfound", async() => {
        const responseLogin = await supertest(web)
            .post("/api/v1/login")
            .send({
                email: "test@gmail.com",
                password: "test"
            })
        logger.debug(responseLogin)
        expect(responseLogin.status).toBe(200)

        const bookmark = await UserTest.create()
        const response = await supertest(web)
            .delete(`/api/v1/bookmark/${bookmark.id + "12"}`)
            .set("Authorization", `Bearer ${responseLogin.body.data.access_token}`)
        
        logger.debug(response)
        expect(response.status).toBe(404)
        expect(response.body.errors).toBe("bookmark not found")
        expect(response.body.errors).toBeDefined()
    })
    it("should reject delete bookmark if request unauthorized", async() => {
        const bookmark = await UserTest.create()
        const response = await supertest(web)
            .delete(`/api/v1/bookmark/${bookmark.id + "12"}`)
        
        logger.debug(response)
        expect(response.status).toBe(401)
        expect(response.body.errors).toBe("unauthorized")
        expect(response.body.errors).toBeDefined()
    })
    it("should able to delete bookmark", async() => {
        const responseLogin = await supertest(web)
            .post("/api/v1/login")
            .send({
                email: "test@gmail.com",
                password: "test"
            })
        logger.debug(responseLogin)
        expect(responseLogin.status).toBe(200)

        const bookmark = await BookmarkTest.create(responseLogin.body.data.id)
        const response = await supertest(web)
            .delete(`/api/v1/bookmark/${bookmark.id}`)
            .set("Authorization", `Bearer ${responseLogin.body.data.access_token}`)
        
        logger.debug(response)
        expect(response.status).toBe(200)
        expect(response.body.status).toBe("success")
    })
})
describe('GET /bookmark/{id}', () => {
    beforeEach(async () => {
        await BookmarkTest.delete();
        await UserTest.delete()
        await UserTest.create()
        console.log("==== bookmark test ====");
    });
    afterEach(async () => {
        await BookmarkTest.delete();
        await UserTest.delete();
    })

    it("should reject get bookmark if id is notfound", async() => {
        const responseLogin = await supertest(web)
            .post("/api/v1/login")
            .send({
                email: "test@gmail.com",
                password: "test"
            })
        logger.debug(responseLogin)
        expect(responseLogin.status).toBe(200)

        const bookmark = await BookmarkTest.create(responseLogin.body.data.id)
        const response = await supertest(web)
            .get(`/api/v1/bookmark/${bookmark.id + "12"}`)
            .set("Authorization", `Bearer ${responseLogin.body.data.access_token}`)
        
        logger.debug(response)
        expect(response.status).toBe(404)
        expect(response.body.errors).toBe("bookmark not found")
    })

    it("should reject get bookmark if request unauthorized", async() => {
        const response = await supertest(web)
            .get(`/api/v1/bookmark/123`)
        
        logger.debug(response)
        expect(response.status).toBe(401)
        expect(response.body.errors).toBe("unauthorized")
    })

    it("should able to get bookmark", async() => {
        const responseLogin = await supertest(web)
            .post("/api/v1/login")
            .send({
                email: "test@gmail.com",
                password: "test"
            })
        logger.debug(responseLogin)
        expect(responseLogin.status).toBe(200)

        const bookmark = await BookmarkTest.create(responseLogin.body.data.id)
        const response = await supertest(web)
            .get(`/api/v1/bookmark/${bookmark.id}`)
            .set("Authorization", `Bearer ${responseLogin.body.data.access_token}`)

        logger.debug(response)
        expect(response.status).toBe(200)
        expect(response.body.status).toBe("success")
        expect(response.body.data.id).toBeDefined()
    })
})

describe('GET /bookmark', () => {
    beforeEach(async () => {
        await BookmarkTest.delete()
        await UserTest.delete()
        await UserTest.create()
        console.log("==== bookmark test ====");
    })
    afterEach(async () => {
        await BookmarkTest.delete()
        await UserTest.delete()
    })
    it("should reject get all bookmark by userid if request access_token invalid", async () => {
        const response = await supertest(web)
            .get(`/api/v1/bookmark`)
            .set('Authorization', `Bearer 121313132snawfjawpjanaoi`)
        
        logger.debug(response)
        expect(response.status).toBe(401)
        expect(response.body.errors).toBe("unauthorized")
    })
    it("should reject get all bookmark by userid if request unauthorized", async () => {
        const response = await supertest(web)
            .get(`/api/v1/bookmark`)
        
        logger.debug(response)
        expect(response.status).toBe(401)
        expect(response.body.errors).toBe("unauthorized")
    })
    it("should able to get all bookmark by userid", async () => {
        const responseLogin = await supertest(web)
            .post("/api/v1/login")
            .send({
                email: "test@gmail.com",
                password: "test"
            })
        logger.debug(responseLogin)
        expect(responseLogin.status).toBe(200)

        BookmarkTest.create(responseLogin.body.data.id)
        BookmarkTest.create(responseLogin.body.data.id)
        const response = await supertest(web)
            .get(`/api/v1/bookmark`)
            .set("Authorization", `Bearer ${responseLogin.body.data.access_token}`)
        
        logger.debug(response)
        expect(response.status).toBe(200)
        expect(response.body.status).toBe("success")
        expect(response.body.data.length).toBeGreaterThan(0)
    })
})