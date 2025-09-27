

import server from "@/api/axiosinstance"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

type UseRevenueAnalyticsProps = {
    period: 'month' | 'year'
    revenueMonth: number
}

export const UseRevenueAnalytics = ({ period, revenueMonth }: UseRevenueAnalyticsProps) => {

    return useQuery({
        queryKey: period === 'month' ?  ['analytics-revenue',period,revenueMonth] : ['analytics-revenue',period],
        queryFn: async () => {
            const res = await server.get(`/instructor/analytics/revenue/timeseries?period=${period}&month=${revenueMonth}`)
            return res.data
        },
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false
    })
}