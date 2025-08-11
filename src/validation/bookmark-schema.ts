import { ZodType, z } from "zod";

export class BookmarkSchema {
    static readonly CREATE: ZodType = z.object({
        user_id: z.string().min(1).max(100),
        comic_id: z.string().min(1).max(100)
    })
    static readonly UPDATE: ZodType = z.object({
        id: z.string().min(1).max(100),
        user_id: z.string().min(1).max(100),
        comic_id: z.string().min(1).max(100)
    })
}