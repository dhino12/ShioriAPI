import { UserModel } from "../model/user";

export const toUserModel = (data: any): UserModel => {
    return new UserModel(
        data.id,
        data.email,
        data.password,
        data.created_at,
        data.access_token,
        data.refresh_token,
        data.name ?? "",
        data.updated_at ?? null
    );
};

export function removeNulls<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v != null) // filter null & undefined
    ) as Partial<T>;
}