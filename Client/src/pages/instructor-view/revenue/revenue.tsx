import server from "@/api/axiosinstance";
import RevenueChart from "@/components/charts";
import { AnalyticsCard } from "@/components/instructor-view/analytics-card/analyticsCard";
import { Button } from "@/components/ui/button";
import { useRevenueSalesSummary } from "@/hooks/queries/useRevenueSalesSummary";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseRevenueAnalytics } from "./hooks/useRevenueAnalytics";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEnrollmentsAnalytics } from "./hooks/useEnrollmentsAnalytics";

type RevenueDashboardProps = {
  isOpenMenu: boolean;
  setIsOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

export type RevenueAnalyticsState = {
  monthToShowRevenue: number;
  showBy: 'month' | 'year';
  year: number
};

const months = ['jan', 'feb', 'mar', 'apr', 'may', 'june', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

const getCurrentMonth = () => {
  const today = new Date()
  return today.getMonth()
}
const getCurrentYear = () => {
  const today = new Date()
  return today.getFullYear()
}

// Main dashboard
export default function RevenueDashboard() {
  const navigate = useNavigate();
  const { data: RevenueSummaryData } = useRevenueSalesSummary();
  const today = new Date()


  const [revenueAnalyticsState, setRevenueAnalyticsState] = useState<RevenueAnalyticsState>({
    monthToShowRevenue: getCurrentMonth(),
    showBy: 'month',
    year: getCurrentYear(),
  })

  const [enrollmentsAnalyticsState, setEnrollmentsAnalyticsState] = useState<RevenueAnalyticsState>({
    monthToShowRevenue: getCurrentMonth(),
    showBy: 'month',
    year: getCurrentYear(),
  })

  const { data: RevenueAnalyticsData, refetch: fetchRevenueAnalytics, isLoading: isRevenueAnalyticsLoading } = UseRevenueAnalytics({ period: revenueAnalyticsState.showBy, revenueMonth: revenueAnalyticsState.monthToShowRevenue, revenueYear: revenueAnalyticsState.year });
  const { data: EnrollmentsAnalyticsData, refetch: fetchEnrollmentsAnalytics, isLoading: isEnrollmentsAnalyticsLoading } = useEnrollmentsAnalytics({ period: enrollmentsAnalyticsState.showBy, revenueMonth: enrollmentsAnalyticsState.monthToShowRevenue, revenueYear: enrollmentsAnalyticsState.year });

  // const handleClick_Menu = () => setIsOpenMenu((prev) => !prev);


  if (!RevenueSummaryData) return null; // optionally show loading skeleton

  return (
    <>
      <Button
        variant="ghost"
        className="cursor-pointer w-fit lg:hidden flex gap-0"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="ml-2" /> Back
      </Button>

      <div className="p-6 pt-2 space-y-8">
        <h3 className="text-3xl font-semibold">Revenue & Sales</h3>

        {/* Analytics Card */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnalyticsCard
            title="Total Revenue"
            value={RevenueSummaryData.totalRevenue}
            lastMonth={RevenueSummaryData.revenueLastMonth ?? 0}
            thisMonth={RevenueSummaryData.revenueThisMonth ?? 0}
            currency
          />
          <AnalyticsCard
            title="Enrollments"
            value={RevenueSummaryData.totalEnrollments}
            lastMonth={RevenueSummaryData.enrollmentsLastMonth ?? 0}
            thisMonth={RevenueSummaryData.enrollmentsThisMonth ?? 0}
          />
          <AnalyticsCard
            title="Discounted Revenue"
            value={RevenueSummaryData.totalDiscountedRevenue}
            lastMonth={RevenueSummaryData.discountedRevenueLastMonth ?? 0}
            thisMonth={RevenueSummaryData.discountedRevenueThisMonth ?? 0}
            currency
          />
        </div>

        <div className="relative">
          <div className="absolute right-20 mt-3 z-20">
            <Select value={revenueAnalyticsState.showBy}
              onValueChange={(val: 'month' | 'year') =>
                setRevenueAnalyticsState(prev => ({ ...prev, showBy: val }))
              }            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="By Month" />
              </SelectTrigger>
              <SelectContent defaultValue={'month'}>
                <SelectGroup>
                  <SelectLabel >Select By</SelectLabel>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="absolute left-20 mt-3 z-20">
            <span className="font-bold text-xl">{months[revenueAnalyticsState.monthToShowRevenue]} {revenueAnalyticsState.year}</span>
          </div>
          {
            !isRevenueAnalyticsLoading &&
            <RevenueChart title="Revenue Over Time" minDate={RevenueAnalyticsData?.firstRevenueDate} analyticsState={revenueAnalyticsState} data={RevenueAnalyticsData?.chartData ?? []} setAnalyticsState={setRevenueAnalyticsState}
              valName="Revenue :$"
            />
          }

        </div>
        <div className="relative">
          <div className="absolute right-20 mt-3 z-20">
            <Select value={enrollmentsAnalyticsState.showBy}
              onValueChange={(val: 'month' | 'year') =>
                setEnrollmentsAnalyticsState(prev => ({ ...prev, showBy: val }))
              }            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="By Month" />
              </SelectTrigger>
              <SelectContent defaultValue={'month'}>
                <SelectGroup>
                  <SelectLabel >Select By</SelectLabel>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="absolute left-20 mt-3 z-20">
            <span className="font-bold text-xl">{months[enrollmentsAnalyticsState.monthToShowRevenue]} {enrollmentsAnalyticsState.year}</span>
          </div>
          {
            !isEnrollmentsAnalyticsLoading &&
            <RevenueChart title="Enrollments Over Time" minDate={EnrollmentsAnalyticsData?.firstRevenueDate} analyticsState={enrollmentsAnalyticsState} data={EnrollmentsAnalyticsData?.chartData ?? []} setAnalyticsState={setEnrollmentsAnalyticsState}
              valName="Enrollments :"
            />
          }

        </div>
      </div>
    </>
  );
}
