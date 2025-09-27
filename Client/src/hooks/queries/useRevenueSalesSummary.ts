import server from "@/api/axiosinstance"
import type { RevenueSalesSummary } from "@/config/config"
import type { RootState } from "@/store"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"

export const useRevenueSalesSummary = () => {

    const userId = useSelector((state: RootState) => state.auth.user?.id)

    return useQuery({
        queryKey: ['revenue-summary', userId],
        queryFn: async () => {
            const res = await server.get(`/instructor/analytics/revenue-and-sales`)
            return res.data as RevenueSalesSummary
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData

    })
}