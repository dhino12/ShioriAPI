export type BookmarkCreateRequest = {
    user_id: string,
    comic_id: string
}

export type BookmarkUpdateRequest = {
    id: string
    user_id?: string,
    comic_id?: string
}