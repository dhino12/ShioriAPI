import {v4 as uuid} from 'uuid'

export class UserModel {
    constructor(
        public id: string,
        public email: string,
        public password: string,
        public createdAt: Date,
        public access_token: string,
        public refresh_token: string,
        public name?: string | null,
        public updatedAt?: Date | null,
    ) {}
    setId() {
        this.id = uuid().substring(0, 10);
    }
}