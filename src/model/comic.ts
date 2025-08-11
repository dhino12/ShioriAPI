export class Comic {
    constructor(
        public id: string,
        public type_id: string,
        public title: string,
        public description: string,
        public thumbnail_url: string,
        public status: string,
        public created_at: Date,
        public deleted: boolean,
        public updated_at?: Date
    ) {}
}