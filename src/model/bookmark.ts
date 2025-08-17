import {v4 as uuid} from 'uuid'
import { ComicModel } from './comic'

export class BookmarkModel {
    constructor(
        public id: string,
        public user_id: string,
        public comic_id: string,
        public created_at: Date,
        public comic?: ComicModel
    ) {}
    setId() {
        this.id = uuid().substring(0,10)
    }
}