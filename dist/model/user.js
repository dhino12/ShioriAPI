"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const uuid_1 = require("uuid");
class UserModel {
    constructor(id, email, password, createdAt, access_token, refresh_token, name, updatedAt) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.access_token = access_token;
        this.refresh_token = refresh_token;
        this.name = name;
        this.updatedAt = updatedAt;
    }
    setId() {
        this.id = (0, uuid_1.v4)().substring(0, 10);
    }
}
exports.UserModel = UserModel;
