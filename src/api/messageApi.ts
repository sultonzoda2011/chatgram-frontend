import { api } from "../lib/utils/axiosConfig";
import type { IMessagePagination } from "../types/messages";

export const getMessages = async ({ userId, limit = 20, before = null }: IMessagePagination) => {
    try {
        const reponse = await api.get(`/messages/${userId}`, {
            params: { limit, before },
        });
        return reponse.data
    } catch (error) {
        console.error(error);

        throw error

    }
}
