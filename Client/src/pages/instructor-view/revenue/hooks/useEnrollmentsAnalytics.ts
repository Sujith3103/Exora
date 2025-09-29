

import server from "@/api/axiosinstance"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

type UseRevenueAnalyticsProps = {
    period: 'month' | 'year'
    revenueMonth: number
    revenueYear:number
}

export const useEnrollmentsAnalytics = ({ period, revenueMonth,revenueYear }: UseRevenueAnalyticsProps) => {

    return useQuery({
        queryKey: period === 'month' ?  ['analytics-enrollments',period,revenueMonth] : ['analytics-enrollments',period],
        queryFn: async () => {
            const res = await server.get(`/instructor/analytics/enrollments/timeseries?period=${period}&month=${revenueMonth}&year=${revenueYear}`)
            return res.data
        },
        staleTime: 1000 * 60 * 30,
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false
    })
}   