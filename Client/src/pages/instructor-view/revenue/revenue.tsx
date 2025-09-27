import RevenueChart from "@/components/charts";
import { AnalyticsCard } from "@/components/instructor-view/analytics-card/analyticsCard";
import { Button } from "@/components/ui/button";
import { useRevenueSalesSummary } from "@/hooks/queries/useRevenueSalesSummary";
import {ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type RevenueDashboardProps = {
  isOpenMenu: boolean;
  setIsOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
};




// Main dashboard
export default function RevenueDashboard({ isOpenMenu, setIsOpenMenu }: RevenueDashboardProps) {
  const navigate = useNavigate();
  const { data: RevenueSummaryData } = useRevenueSalesSummary();

  const handleClick_Menu = () => setIsOpenMenu((prev) => !prev);

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
          <div className="absolute right-20 mt-3">
            <span>by:</span> <span>this month</span>
          </div>
          <RevenueChart />
        </div>
      </div>
    </>
  );
}
