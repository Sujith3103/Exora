import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import { startOfDay } from "date-fns";


export const getRevenueAndSalesAnalytics = async (req: Request, res: Response) => {

    const userId = req.user?.id

    if (!userId) return res.status(401).json({ message: 'user not authenticated' })

    let totalRevenue;
    let revenueThisMonth;
    let revenueLastMonth;

    let totalEnrollments;
    let enrollmentsThisMonth;
    let enrollmentsLastMonth

    let totalDiscountedRevenue
    let discountedRevenueLastMonth
    let discountedRevenueThisMonth

    try {
        const today = new Date();
        const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

        let CourseRevenueAnalytics;
        let courseHistory;

        await prisma.$transaction(async (tx) => {
            CourseRevenueAnalytics = await tx.courseRevenueAnalytics.findFirst({
                where: { instructorId: userId }
            })
            totalEnrollments = CourseRevenueAnalytics?.totalEnrolls
            totalRevenue = CourseRevenueAnalytics?.totalRevenue,
                totalDiscountedRevenue = CourseRevenueAnalytics?.totalDiscountedRevenue

            const monthlyRevenue = await prisma.$queryRawUnsafe<any[]>(`
  SELECT 
    "instructorId",
    date_trunc('month', "date") AS month,
    SUM("revenue")::bigint AS "totalRevenue",
    SUM("enrollments")::bigint AS "totalEnrollments",
    SUM("dicountedRevenue")::bigint AS "totalDiscountedRevenue"
  FROM "CourseRevenueHistory"
  WHERE "date" >= date_trunc('month', CURRENT_DATE - interval '1 month')
  GROUP BY "instructorId", month
  ORDER BY month DESC;
             `);

            courseHistory = monthlyRevenue.map(r => ({
                ...r,
                totalRevenue: Number(r.totalRevenue),
                totalEnrollments: Number(r.totalEnrollments),
                totalDiscountedRevenue: Number(r.totalDiscountedRevenue),
            }));

            courseHistory.map((data, index) => {
                if (index === 0) {
                    revenueThisMonth = data.totalRevenue
                    enrollmentsThisMonth = data.totalEnrollments
                    discountedRevenueThisMonth = data.totalDiscountedRevenue

                } else {
                    revenueLastMonth = data.totalRevenue
                    enrollmentsLastMonth = data.totalEnrollments
                    discountedRevenueLastMonth = data.totalDiscountedRevenue
                }
            })

        })

        return res.json({
            totalDiscountedRevenue,
            totalEnrollments,
            totalRevenue,

            revenueLastMonth,
            revenueThisMonth,

            discountedRevenueLastMonth,
            discountedRevenueThisMonth,

            enrollmentsLastMonth,
            enrollmentsThisMonth,
        })


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'failed to get revenue and sales analytics data'
        })
    }

}

function getMonthRange(year: number, monthIndex: number) {
    // Start: first day of the given month
    const startOfMonth = new Date(year, monthIndex, 1);

    // End: last day of the given month
    const endOfMonth = new Date(year, monthIndex + 1, 0);

    return { startOfMonth, endOfMonth };
}
function formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getDaysInMonth(year: number, month: number): [string, number][] {
    const days: [string, number][] = [];
    // Month is 0-based in JS (0 = Jan, 8 = Sep)
    const date = new Date(year, month, 1);

    const today = new Date()

    let smth = 0
    while (date.getMonth() === month) {
        days.push([formatDateLocal(date), 0]);
        date.setDate(date.getDate() + 1);
        if (smth) {
            break
        }
        if (today.getDate() === date.getDate() && today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth()) {
            smth = 1
        }
    }
    return days;
}

function parseChartDataToFilledDates(
    chartData: [string, number][],
    filledDate: [string, number][]
): [string, number][] {
    // Create a map from chartData for fast lookup
    const chartMap = new Map<string, number>();
    chartData.forEach(([date, value]) => {
        chartMap.set(date, value);
    });

    // Replace 0 values in filledDate if chartData has the value
    return filledDate.map(([date, value]) => {
        if (chartMap.has(date)) {
            return [date, chartMap.get(date)!]; // replace with actual value
        }
        return [date, value]; // keep as is (likely 0)
    });
}


export const getRevenueTimeSeries = async (req: Request, res: Response) => {
  const { period = "month" } = req.query as { period?: "month" | "year" };
  const { month, year } = req.query;

  const monthNum = parseInt(month as string, 10);
  const yearNum = parseInt(year as string, 10);

  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "User not authenticated" });

  // Boundaries
  const startOfMonth = new Date(yearNum, monthNum, 1);
  const endOfMonth = new Date(yearNum, monthNum + 1, 0);
  const startOfYear = new Date(yearNum, 0, 1);
  const endOfYear = new Date(yearNum, 11, 31);

  try {
    let result: any[] = [];

    if (period === "month") {
      //  Group daily inside given month
      result = await prisma.$queryRawUnsafe<any[]>(
        `
        SELECT 
          date_trunc('day', "date")::date AS period,
          SUM("revenue")::bigint AS "totalRevenue"
        FROM "CourseRevenueHistory"
        WHERE "instructorId" = $1
          AND "date" >= $2
          AND "date" <= $3
        GROUP BY period
        ORDER BY period ASC;
        `,
        userId,
        startOfMonth,
        endOfMonth
      );
    } else {
      //  Group monthly inside given year
      result = await prisma.$queryRawUnsafe<any[]>(
        `
        SELECT 
          date_trunc('month', "date")::date AS period,
          SUM("revenue")::bigint AS "totalRevenue"
        FROM "CourseRevenueHistory"
        WHERE "instructorId" = $1
          AND "date" >= $2
          AND "date" <= $3
        GROUP BY period
        ORDER BY period ASC;
        `,
        userId,
        startOfYear,
        endOfYear
      );
    }

    //  Map results
    let chartData: [string, number][] = result.map((r) => [
      new Date(r.period).toISOString().split("T")[0],
      Number(r.totalRevenue),
    ]);

    //  Only fill missing days when period = month
    if (period === "month") {
      const filledDate = getDaysInMonth(yearNum, monthNum);
      chartData = parseChartDataToFilledDates(chartData, filledDate);
    }

    //  First revenue date
    const firstRevenue = await prisma.courseRevenueHistory.findFirst({
      orderBy: { date: "asc" },
    });

    return res.json({
      chartData,
      firstRevenueDate: firstRevenue?.date || null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// export const getRevenueTimeSeries = async (req: Request, res: Response) => {
//     const { period = "month" } = req.query as { period?: "month" | "year" };
//     const { month } = req.query
//     const { year } = req.query

//     const { type } = req.query as { type?: 'revenue' | 'enrollments' }

//     const monthNum = parseInt(month as string, 10); // shift to 0-based
//     const yearNum = parseInt(year as string, 10); // shift to 0-based

//     const userId = req.user?.id;

//     if (!userId) return res.status(401).json({ message: "User not authenticated" });

//     const today = new Date();

//     const startOfMonth = new Date(yearNum, monthNum, 1)
//     const endOfMonth = new Date(yearNum, monthNum + 1, 0)

//     const startOfYear = new Date(yearNum, 0, 1);   // Jan 1, 2025
//     const endOfYear = new Date(yearNum, 11, 31); // Dec 31, 2025

//     let chartData: [string, number][] = []

//     let firstRevenueDate;
//     try {
//         let groupBy: "month" | "year" = "month";
//         switch (period) {
//             case "month":
//                 groupBy = "month";
//                 break;
//             case "year":
//                 groupBy = "year";
//                 break;
//             default:
//                 groupBy = "month";
//         }
//         const result = await prisma.$queryRawUnsafe<any[]>(`
//   SELECT 
//     date_trunc('${groupBy}', "date")::date AS period,
//     SUM("revenue")::bigint AS totalRevenue
//   FROM "CourseRevenueHistory"
//   WHERE "instructorId" = $1
//     AND "date" >= $2
//     AND "date" <= $3
//   GROUP BY period
//   ORDER BY period ASC
// `, userId, groupBy === 'month' ? startOfMonth : startOfYear, groupBy === 'month' ? endOfMonth : endOfYear);

//         const chartData = result.map(r => [r.period.toISOString().split("T")[0], Number(r.totalRevenue)]);

//         // const result = await prisma.courseRevenueHistory.groupBy({
//         //     where: {
//         //         instructorId: userId,
//         //         date: {
//         //             gte: groupBy === 'month' ? startOfMonth : startOfYear,
//         //             lte: groupBy === 'month' ? endOfMonth : endOfYear
//         //         }
//         //     },
//         //     by: [
//         //         "date"
//         //     ],
//         //     _sum: {
//         //         revenue: true,
//         //     },
//         //     orderBy: { date: 'asc' },

//         // })
//         const firstRevenue = await prisma.courseRevenueHistory.findFirst({
//             orderBy: {
//                 date: 'asc',  // ascending → earliest first
//             },
//         });

//         if (firstRevenue) {
//             firstRevenueDate = firstRevenue.date
//         }
//         // Use raw SQL for flexible grouping

//         result.forEach(item => {
//             const formattedDate = new Date(item.date).toISOString().split("T")[0];
//             chartData.push([formattedDate, item._sum.revenue ?? 0]); // push as array
//         });


//         const filledDate = getDaysInMonth(year as unknown as number, monthNum);

//         const finalData = parseChartDataToFilledDates(chartData, filledDate)

//         return res.json({
//             chartData: finalData,
//             firstRevenueDate
//         });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };


export const getEnrollmentsTimeSeries = async (req: Request, res: Response) => {
  const { period = "month" } = req.query as { period?: "month" | "year" };
  const { month, year } = req.query;

  const monthNum = parseInt(month as string, 10);
  const yearNum = parseInt(year as string, 10);

  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "User not authenticated" });

  // Boundaries
  const startOfMonth = new Date(yearNum, monthNum, 1);
  const endOfMonth = new Date(yearNum, monthNum + 1, 0);
  const startOfYear = new Date(yearNum, 0, 1);
  const endOfYear = new Date(yearNum, 11, 31);

  try {
    let result: any[] = [];

    if (period === "month") {
      // Group daily inside given month
      result = await prisma.$queryRawUnsafe<any[]>(
        `
        SELECT 
          date_trunc('day', "date")::date AS period,
          SUM("enrollments")::bigint AS "totalEnrollments"
        FROM "CourseRevenueHistory"
        WHERE "instructorId" = $1
          AND "date" >= $2
          AND "date" <= $3
        GROUP BY period
        ORDER BY period ASC;
        `,
        userId,
        startOfMonth,
        endOfMonth
      );
    } else {
      // Group monthly inside given year
      result = await prisma.$queryRawUnsafe<any[]>(
        `
        SELECT 
          date_trunc('month', "date")::date AS period,
          SUM("enrollments")::bigint AS "totalEnrollments"
        FROM "CourseRevenueHistory"
        WHERE "instructorId" = $1
          AND "date" >= $2
          AND "date" <= $3
        GROUP BY period
        ORDER BY period ASC;
        `,
        userId,
        startOfYear,
        endOfYear
      );
    }

    // Map results
    let chartData: [string, number][] = result.map((r) => [
      new Date(r.period).toISOString().split("T")[0],
      Number(r.totalEnrollments),
    ]);

    // Only fill missing days when period = month
    if (period === "month") {
      const filledDate = getDaysInMonth(yearNum, monthNum);
      chartData = parseChartDataToFilledDates(chartData, filledDate);
    }

    // First enrollment date (from revenue history since enrollments stored there)
    const firstEnrollment = await prisma.courseRevenueHistory.findFirst({
      orderBy: { date: "asc" },
    });

    return res.json({
      chartData,
      firstEnrollmentDate: firstEnrollment?.date || null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
