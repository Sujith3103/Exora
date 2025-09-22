// utils/couponUtils.ts
import { startOfMonth } from "date-fns";
import { prisma } from "../utils/prisma";

export async function validateCouponCore({
  couponCode,
  courseId,
  instructorId,
  userId,
}: {
  couponCode: string;
  courseId: string;
  instructorId: string;
  userId?: string;
}) {
  const month = startOfMonth(new Date());

  const coupons = await prisma.coupon.findMany({
    where: {
      userId: instructorId,
      code: couponCode,
    },
  });

  if (coupons.length === 0) {
    return { valid: false, reason: "Coupon not found" };
  }

  const item = coupons[0]; // assuming unique codes per instructor

  // Date check
  const validFromDate = new Date(item.validFrom);
  const validUntilDate = new Date(item.validUntil);
  if (validFromDate.getTime() > Date.now() || validUntilDate.getTime() <= Date.now()) {
    return { valid: false, reason: "Coupon is expired or not active yet" };
  }

  // Global limit
  if (item.timesUsed >= item.noOfCoupons) {
    return { valid: false, reason: "Maximum coupon limit reached" };
  }

  // Per-user limit
  if (userId) {
    const usedByUser = await prisma.couponApplication.count({
      where: { couponId: item.id, userId, status: "REDEEMED" },
    });
    if (usedByUser >= item.limitPerUser) {
      return { valid: false, reason: "Maximum limit per user reached" };
    }
  }

  // Course applicability
  if (item.applyTo !== "allCourses" && item.courseId !== courseId) {
    return { valid: false, reason: "Coupon not valid for this course" };
  }

  // ✅ valid coupon
  return { valid: true, coupon: item };
}
