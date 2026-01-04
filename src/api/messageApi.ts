import { api } from "../lib/utils/axiosConfig";
import type { MessagePagination } from "../types/messages";

export const getMessages = async ({ userId, limit = 20, before = null }: MessagePagination) => {
    const reponse = await api.get(`/messages/${userId}`, {
        params: { limit, before },
    });
    return reponse.data
}
