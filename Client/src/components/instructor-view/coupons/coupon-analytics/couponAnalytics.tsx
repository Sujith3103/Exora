import { Card } from '@/components/ui/card'
import type { Coupon } from '@/config/config'
import { useCouponAnalytics } from '@/hooks/queries/useCouponAnalytics'
import type { RootState } from '@/store'
import { TrendingDown, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

type CouponAnalyticsProps = {
    activeCoupons: Coupon[]
}

export type couponAnalyticsType = {
    totalTimesApplied: number
    timesAppliedThisMonth: number
    timesAppliedPrevMonth: number

    revenueByCoupon: number
    timesRedeemed: number

    conversionRate: number
}

const CouponAnalytics = React.memo(({ timesAppliedPrevMonth, timesAppliedThisMonth, totalTimesApplied, conversionRate, revenueByCoupon, timesRedeemed }: couponAnalyticsType) => {

    const calculateAppliedCouponsMonthDifference = () => {
        const diffPercentage = ((timesAppliedThisMonth - timesAppliedPrevMonth) / timesAppliedPrevMonth) * 100;

        if (diffPercentage >= 0) return { diffPercentage, growth: true };
        else if (diffPercentage < 0) return { diffPercentage: Math.abs(diffPercentage), growth: false };
    }

    const appliedDiff = calculateAppliedCouponsMonthDifference();

    return (
        <div className='flex w-full gap-10 justify-evenly mb-10 mt-5'>
            <Card className="w-1/5 p-5 flex flex-col gap-2 border rounded-lg shadow-sm">
                <p className="text-sm text-muted-foreground">Total Coupons Applied</p>
                <span className="text-2xl font-bold">{totalTimesApplied}</span>

                <div className="flex items-center gap-1 mt-1 font-semibold">
                    {appliedDiff?.growth && <TrendingUp className="text-green-600" />}
                    {!appliedDiff?.growth && <TrendingDown className="text-red-500" />}
                    <span className={`${!appliedDiff?.growth? "text-red-500" : "text-green-600"}`}>
                        {`${appliedDiff?.diffPercentage.toFixed(2)}% this month (${timesAppliedThisMonth})`}
                    </span>
                </div>
            </Card>

            <Card className='w-1/5'>

            </Card>
            <Card className='w-1/5'>

            </Card>

        </div>
    )
})

export default CouponAnalytics
