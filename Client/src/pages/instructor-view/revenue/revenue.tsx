import RevenueChart from "@/components/charts"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import React from "react"

export default function RevenueDashboard() {
  return (
    <div className="p-6 space-y-8">
      <h3 className="text-3xl font-semibold">Revenue & Sales</h3>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Revenue */}
        <Card className="bg-white shadow-sm hover:shadow-md transition">
          <CardHeader>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <CardTitle className="text-3xl font-bold">$1,231</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-green-600">
            <TrendingUp className="w-5 h-5" />
            <span>+1.25% this month ($121)</span>
          </CardContent>
        </Card>

        {/* Enrollments */}
        <Card className="bg-white shadow-sm hover:shadow-md transition">
          <CardHeader>
            <p className="text-sm text-gray-500">Enrollments</p>
            <CardTitle className="text-3xl font-bold">352</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-red-600">
            <TrendingDown className="w-5 h-5" />
            <span>-0.8% this month (45 enrollments)</span>
          </CardContent>

        </Card>

        {/* discounted revenue */}
        <Card className="bg-white shadow-sm hover:shadow-md transition">
          <CardHeader>
            <p className="text-sm text-gray-500">Discounted Revenue</p>
            <CardTitle className="text-3xl font-bold">$252</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-red-600">
            <TrendingDown className="w-5 h-5" />
            <span>-0.8% this month (45 enrollments)</span>
          </CardContent>

        </Card>

        {/* Add more cards similarly: Average Revenue, Refund Rate, etc. */}
      </div>
      <div className="relative ">
        <div className="absolute right-20 mt-3">
          <span>by:</span>
          <span>this month</span>
        </div>
        <RevenueChart />
      </div>
    </div>
  )
}
