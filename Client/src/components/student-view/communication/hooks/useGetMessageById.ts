import server from "@/api/axiosinstance";
import type { Conversation } from "@/config/config";
import { useQuery } from "@tanstack/react-query";

export const useGetMessageById = (conversationId: string) => {
  return useQuery<Conversation>({
    queryKey: ['message', conversationId],
    queryFn: async (): Promise<Conversation> => {
      const res = await server.get(`/communication/message/${conversationId}`);
      return res.data.data;
    },
    enabled: !!conversationId, // only runs when id exists
  });
};
