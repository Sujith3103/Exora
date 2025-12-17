import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";


interface AnalyticsInput {
    lastMonth: number;
    thisMonth: number;
}

interface AnalyticsOutput {
    lastMonth: number;
    thisMonth: number;
    difference: number;
    percentageChange: number | null;
    growth: boolean;
}

// Helper function

// Reusable card component
type AnalyticsCardProps = {
    title: string;
    value: number;
    lastMonth: number;
    thisMonth: number;
    currency?: boolean;
    positiveColor?: string;
    negativeColor?: string;
};

const getAnalyticsDifference = ({ lastMonth, thisMonth }: AnalyticsInput): AnalyticsOutput => {
    const difference = thisMonth - lastMonth;
    const percentageChange =
        lastMonth === 0 ? null : parseFloat(((difference / lastMonth) * 100).toFixed(1));
    const growth = thisMonth > lastMonth;

    return { lastMonth, thisMonth, difference, percentageChange, growth };
};


export const AnalyticsCard = ({ title, value, lastMonth, thisMonth, currency = false, positiveColor = "text-green-600", negativeColor = "text-red-600",
}: AnalyticsCardProps) => {
    const analytics = getAnalyticsDifference({ lastMonth, thisMonth });

    return (
        <Card className="bg-white shadow-sm hover:shadow-md transition">
            <CardHeader>
                <p className="text-sm text-gray-500">{title}</p>
                <CardTitle className="text-3xl font-bold">
                    {currency ? `$${value}` : value}
                </CardTitle>
            </CardHeader>
            <CardContent className={`flex items-center gap-2 ${analytics.growth ? positiveColor : negativeColor}`}>
                {analytics.growth ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                <div className="flex items-center gap-1">
                    {analytics.growth ? "+" : ""}
                    {analytics.percentageChange ?? "N/A"}%
                    <span className="mx-1">this month</span>
                    ({currency ? "$" : ""}
                    {analytics.difference}
                    {currency ? "" : ""} {title})
                </div>
            </CardContent>
        </Card>
    );
};