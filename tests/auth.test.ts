import supertest from "supertest";
import { UserTest } from "./test-util"
import router from "../src/app/router";
import { logger } from "../src/app/logging";

describe('POST /api/v1/register', () => { 
    beforeEach(async () => {
        await UserTest.delete();
        console.log("==== register test ====");
    })
        afterEach(async () => {
        await UserTest.delete();
    })

    it("should reject register new user if request is invalid", async() => {
        const response = await supertest(router)
            .post("/api/v1/register")
            .send({
                email: "",
                password: ""
            });
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.status).toBeDefined()
    })

    it("should register new user", async () => {
        const response = await supertest(router)
            .post("/api/v1/register")
            .send({
                email: "test@gmail.com",
                password: "test",
            });

        logger.debug(response.body);
        expect(response.status).toBe(201);
        expect(response.body.data.email).toBe("test@gmail.com");
        expect(response.body.data.id).toBeDefined();
    })
})

describe('POST /api/v1/login', () => {
    beforeEach(async () => {
        await UserTest.delete();
        await UserTest.create();
        console.log("==== login test ====");
    })
    afterEach(async () => {
        await UserTest.delete();
    })

    it("should be able to login", async () => {
        const response = await supertest(router)
            .post("/api/v1/login")
            .send({
                email: "test@gmail.com",
                password: "test"
            })

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.email).toBe("test@gmail.com");
        expect(response.body.data.access_token).toBeDefined();
    })

    it("should reject login user if username is wrong", async () => {
        const response = await supertest(router)
            .post("/api/v1/login")
            .send({
                email: "salah@gmail.com",
                password: "test"
            });
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.status).toBeDefined();
    })

    it("should reject login user if password is wrong", async () => {
        const response = await supertest(router)
            .post("/api/v1/login")
            .send({
                email: "test@gmail.com",
                password: "salah"
            });
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.status).toBeDefined();
    })
})

describe('POST /api/v1/logout', () => { 
    beforeEach(async () => {
        await UserTest.delete();
        await UserTest.create();
        console.log("==== logout test ====");
    })
    afterEach(async () => {
        await UserTest.delete();
    })

    it("should reject logout unauthorized", async() => {
        const response = await supertest(router)
            .post("/api/v1/logout")

        logger.debug(response)
        expect(response.status).toBe(401)
        expect(response.body.status).toBeDefined()
    })

    it("should able to logout", async() => {
        const responseLogin = await supertest(router)
            .post("/api/v1/login")
            .send({
                email: "test@gmail.com",
                password: "test"
            })
        logger.debug(responseLogin)
        expect(responseLogin.status).toBe(200)

        const responseLogout = await supertest(router)
            .post("/api/v1/logout")
            .set("Authorization", `Bearer ${responseLogin.body.data.access_token}`)

        logger.debug(responseLogout)
        expect(responseLogout.status).toBe(200)
        expect(responseLogout.body.status).toBe("success")

        const refreshToken = UserTest.getRefreshToken(responseLogout.headers['set-cookie'])
        expect(refreshToken).toBeNull()
    })
})

describe('POST /api/v1/refreshtoken ', () => { 
    beforeEach(async () => {
        console.log("==== refreshtoken test ====");
        await UserTest.delete()
        await UserTest.create()
    })
    afterEach(async () => {
        await UserTest.delete()
    })

    it("should reject token refresh when refresh_token or access_token is missing", async() => {
        const response = await supertest(router)
            .post("/api/v1/refreshtoken")
            .set("Authorization", ``)
        logger.debug(response)
        expect(response.status).toBe(401)
        expect(response.body.status).toBe("unauthorized")
    })

    it("should able to refreshtoken", async() => {
        const responseLogin = await supertest(router)
            .post("/api/v1/login")
            .send({
                email: "test@gmail.com",
                password: "test"
            })
        logger.debug(responseLogin)
        expect(responseLogin.status).toBe(200)
        const refreshTokenOld = UserTest.getRefreshToken(responseLogin.headers["set-cookie"])

        const response = await supertest(router)
            .post("/api/v1/refreshtoken")
            .set("Authorization", `Bearer ${responseLogin.body.data.access_token}`)
            .set("Cookie", `${responseLogin.headers["set-cookie"][0]}`)
        logger.debug(response)
        expect(response.status).toBe(200)
        expect(response.body.status).toBe("success")
        expect(response.body.data.access_token).toBeDefined()
        const refreshTokenNew = UserTest.getRefreshToken(response.headers["set-cookie"])
        expect(refreshTokenOld).not.toBe(refreshTokenNew)
    })
})