import { Card } from '@/components/ui/card'
import HoverCard from '@/components/ui/hover-card'
import { CircleQuestionMarkIcon, TrendingDown, TrendingUp } from 'lucide-react'
import React from 'react'



export type couponAnalyticsType = {
    totalTimesApplied: number
    timesAppliedThisMonth: number
    timesAppliedPrevMonth: number

    revenueThisMonth: number
    revenueLastMonth: number
    totalRevenue: number

    conversionRateThisMonth: number
    conversionRateLastMonth: number
}

const CouponAnalytics = React.memo(({ timesAppliedPrevMonth, timesAppliedThisMonth, totalTimesApplied, conversionRateLastMonth, conversionRateThisMonth, revenueLastMonth, revenueThisMonth, totalRevenue }: couponAnalyticsType) => {

    const calculateAppliedCouponsMonthDifference = () => {
        let diffPercentage;
        if (timesAppliedPrevMonth === 0) {
            diffPercentage = timesAppliedThisMonth * 100
        }
        else {
            diffPercentage = ((timesAppliedThisMonth - timesAppliedPrevMonth) / timesAppliedPrevMonth) * 100;
        }
        if (diffPercentage >= 0) return { diffPercentage, growth: true };
        else if (diffPercentage < 0) return { diffPercentage: Math.abs(diffPercentage), growth: false };
    }

    const getRevenuePercentageDiff = (revenueLastMonth: number, revenueThisMonth: number): number => {
        if (revenueLastMonth === 0) return 100; // Avoid division by zero, assume 100% growth
        const diff = revenueThisMonth - revenueLastMonth;
        const percentDiff = (diff / revenueLastMonth) * 100;
        return parseFloat(percentDiff.toFixed(2)); // Round to 2 decimal places
    }

    // const conversionRateDiff = (conversionRateLastMonth:number, conversionRateThisMonth:number) => {

    //     if(con)

    // }

    const appliedDiff = calculateAppliedCouponsMonthDifference();

    return (
        <div className='flex md:flex-row flex-col w-full lg:gap-10 lg:justify-evenly justify-between mb-10 mt-5 flex-wrap items-center gap-3'>
            <Card className="w-1/5 p-5 flex flex-col gap-2 border rounded-lg shadow-sm  min-w-[250px]">
                <p className="text-sm text-muted-foreground">Total Coupons Applied</p>
                <span className="text-2xl font-bold">{totalTimesApplied}</span>

                <div className="flex items-center gap-1 mt-1 font-semibold">
                    {appliedDiff?.growth && <TrendingUp className="text-green-600" />}
                    {!appliedDiff?.growth && <TrendingDown className="text-red-500" />}
                    <span className={`${!appliedDiff?.growth ? "text-red-500" : "text-green-600"}`}>
                        {`${appliedDiff?.diffPercentage.toFixed(2)}% this month (${timesAppliedThisMonth})`}
                    </span>
                </div>
            </Card>

            <Card className="w-1/5 p-5 flex flex-col gap-2 border rounded-lg shadow-sm  min-w-[250px]">
                <div className="text-sm text-muted-foreground flex items-center relative">
                    Conversion rate this month
                    <span className=" relative group ml-auto">
                        <CircleQuestionMarkIcon size={17} className="cursor-pointer" />

                        {/* Arrow (only shows on hover) */}
                        <HoverCard message='Conversion rate is the coupon appiled vs coupon redeemed ratio/percentage' />
                    </span>
                </div>

                <span className="text-2xl font-bold">{conversionRateThisMonth}%</span>
                {
                    conversionRateLastMonth < conversionRateThisMonth ? (
                        <>
                            <p className='flex gap-2 text-green-600'><TrendingUp />{conversionRateThisMonth - conversionRateLastMonth}% higher then last month</p>
                        </>
                    ) : (
                        <>
                            <p className='flex g-2 text-red-500'><TrendingDown /> {conversionRateLastMonth - conversionRateThisMonth}% lower than last month</p>
                        </>
                    )
                }
            </Card>
            <Card className="w-1/5 p-5 flex flex-col gap-2 border rounded-lg shadow-sm  min-w-[250px]    ">
                <p className="text-sm text-muted-foreground">Revenue generate by coupons</p>

                <span className="text-2xl font-bold">${totalRevenue}</span>
                {
                    revenueLastMonth < revenueThisMonth ? (
                        <>
                            <p className='flex gap-2 text-green-600'><TrendingUp /> {getRevenuePercentageDiff(revenueLastMonth,revenueThisMonth)}% higher then last month</p>
                        </>
                    ) : (
                        <>
                            <p className='flex g-2 text-red-500'><TrendingDown />  {getRevenuePercentageDiff(revenueLastMonth,revenueThisMonth)}% lower than last month</p>
                        </>
                    )
                }
            </Card>
            {/* <HoverCard /> */}

        </div>
    )
})

export default CouponAnalytics
