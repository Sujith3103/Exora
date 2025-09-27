

import server from "@/api/axiosinstance"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

type UseRevenueAnalyticsProps = {
    period: 'month' | 'year'
    revenueMonth: number
}

export const useEnrollmentsAnalytics = ({ period, revenueMonth }: UseRevenueAnalyticsProps) => {

    return useQuery({
        queryKey: period === 'month' ?  ['analytics-enrollments',period,revenueMonth] : ['analytics-enrollments',period],
        queryFn: async () => {
            const res = await server.get(`/instructor/analytics/revenue/timeseries?period=${period}`)
            return res.data
        },
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false
    })
}   