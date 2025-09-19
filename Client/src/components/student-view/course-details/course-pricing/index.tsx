import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CoursePricingSkeleton } from "./course-pricing-Skeleton";

import { useCourseDetails } from "@/hooks/queries/useCourseDetails";
import { useCart } from "@/hooks/queries/useCart";
import useCartMutation from "@/hooks/mutations/useCartMutation";
import { addCartItemToDb, getCartItemsFromIDB } from "@/lib/indexdb";

import type { RootState } from "@/store";
import type { CourseDetails } from "@/store/courseDetailsSlice";
import type { CartItem } from "@/store/cartSlice";

import server from "@/api/axiosinstance";
import useCouponMutation from "@/hooks/mutations/useCouponMutation";
import { number } from "echarts";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import usePurchaseMutation from "@/hooks/mutations/usePurchaseMutation";

type validateCouponProps = {
    courseId: string,
    instructorId: string,
    coupon: string,
    isAuthenticated: boolean,
    userId: string,
}

type Coupon = {
    id: string
    title: string
    code: string
    discountType: "percentage" | "fixed" // add more if backend supports
    discount: number
    noOfCoupons: number
    limitPerUser: number
    onlyFor: "tier_1" | "tier_2" | "tier_3" | "all" // guess from your system
    autoApply: boolean
    timesUsed: number
    totalRevenue: number
    courseId: string
    applyTo: "oneCourse" | "allCourses" // extend if needed
    validUntil: string // ISO date string
    validFrom: string  // ISO date string
    userId: string
}


const Student_CourseDetailsPricing = () => {


    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const params = searchParams.get('couponCode')
    const queryClient = useQueryClient()


    const { data: itemsInCart, refetch, isLoading: isFetchingCartItems } = useCart();

    const { addToCart } = useCartMutation();
    const { data, isLoading } = useCourseDetails(id || "");
    const inputRef = useRef<HTMLInputElement>(null);
    const course = data?.data;

    const { validateCoupon, validateCouponOnLogin } = useCouponMutation()
    const { purchaseCourse } = usePurchaseMutation()

    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const userId = useSelector((state: RootState) => state.auth.user?.id);

    const [cartItemsId, setCartItemsId] = useState<Set<string>>();
    const [isCouponApplyLoading, setIsCouponApplyLoading] = useState(false);
    const [isCouponFetching, setIsCouponFetching] = useState(true);
    const [couponData, setCouponData] = useState<Coupon>()
    const [discountedPrice, setDiscountedPrice] = useState({
        originalPrice: 0,
        discountApplied: 0,
        finalPrice: 0,
    })

    // ─── Handlers ───────────────────────────────────────────

    const handleBuyNow = async () => {
        if (!course) return;

        if (!isAuthenticated) {
            return navigate(`/auth/login?redirect=/course/${course.id}`);
        }

        if (couponData) {
            const finalPrice = calculateCouponDiscount(course.pricing, couponData)
            purchaseCourse.mutate({
                courseId: course.id,
                ...finalPrice
            })

        }

    };

    async function fetchCartItems() {
        if (isAuthenticated) {
            const ids = new Set(itemsInCart.data.map((item: any) => item.courseId));
            setCartItemsId(ids as Set<string>);
        } else {
            const data = await getCartItemsFromIDB()
            const ids = new Set(data.map((item: any) => item.courseId));
            setCartItemsId(ids)
        }

    }

    const handleAddToCart = (course: CourseDetails) => {
        if (!course.thumbnailUrl) return;

        const item: CartItem = {
            courseId: course.id,
            title: course.title,
            instructorName: course.instructor.name,
            price: course.pricing,
            thumbnailUrl: course.thumbnailUrl,
            status: "ACTIVE",
            addedAt: Date.now(),
        };

        isAuthenticated ? addToCart.mutate(item) : addCartItemToDb(item);
        fetchCartItems()
    };

    const calculateCouponDiscount = (coursePrice: number, coupon: Coupon) => {
        let finalPrice = coursePrice
        if (coupon.discountType === "percentage") {
            finalPrice = coursePrice - (coursePrice * coupon.discount) / 100
        } else if (coupon.discountType === "fixed") {
            finalPrice = coursePrice - coupon.discount
        }

        // avoid negative prices
        if (finalPrice < 0) finalPrice = 0

        setDiscountedPrice({
            originalPrice: coursePrice,
            discountApplied: coursePrice - finalPrice,
            finalPrice,
        })

        return {
            originalPrice: coursePrice,
            discountApplied: coursePrice - finalPrice,
            finalPrice,
        }
    }


    const handleValidateCoupon = () => {
        const couponCode = inputRef.current?.value || searchParams.get("couponCode") || ""
        const validateCouponProps: validateCouponProps = {
            coupon: couponCode,
            courseId: course.id,
            instructorId: course.instructor.id,
            isAuthenticated: isAuthenticated,
            userId: userId as unknown as string
        }
        if (inputRef.current) {
            inputRef.current.value = ''
        }
        const res = validateCoupon.mutate(validateCouponProps, {
            onSettled: (data) => {
                if (data.success) {
                    queryClient.setQueryData(['validate-coupon', data.data.userId, data.data.title], data)
                    setCouponData(data.data)
                    calculateCouponDiscount(course.pricing, data.data)
                    toast.dismiss()
                    toast.success(data.message, {
                        style: { justifyContent: "center" },
                        duration: 2500,
                    })
                    setSearchParams({ couponCode: data.data.code });
                }
                else if (!data.success) {
                    toast.dismiss()
                    toast.error(data.message, {
                        style: { justifyContent: "center" },
                        duration: 2000,
                    });
                }
                setIsCouponApplyLoading(false)
                setIsCouponFetching(false)
            }
        })
    }

    // ─── Effects ────────────────────────────────────────────

    useEffect(() => {

        fetchCartItems()
    }, [itemsInCart]);

    useEffect(() => {
        if (course?.id && params) {
            handleValidateCoupon()
        }
        else if (course?.id && !params) {
            setIsCouponFetching(true)

            validateCouponOnLogin.mutate({ courseId: course.id, instructorId: course.instructor.id, userId: userId as unknown as string, isAuthenticated: isAuthenticated }, {
                onSettled: (data) => {
                    if (data.success) {
                        setCouponData(data.data)
                        calculateCouponDiscount(course.pricing, data.data)
                        setSearchParams({ couponCode: data.data.code })
                    }

                    setIsCouponFetching(false)
                }
            })
        }
    }, [course])

    useEffect(() => {
        async function refetchCart() {
            if (isAuthenticated) {
                await refetch()
            }
        }
        refetchCart()
    }), [isAuthenticated]

    // ─── Render ─────────────────────────────────────────────

    if (!id) return null;
    if (isLoading || isCouponFetching) return <CoursePricingSkeleton />;
    if (!course) return null;

    return (
        <div className="sticky top-0 p-5 h-full">
            <Card className="h-full pt-0 rounded-none">
                {/* Thumbnail */}
                <img
                    src={course.thumbnailUrl}
                    loading="eager"
                    className="p-3 border-b min-w-full min-h-[200px] max-h-[220px] object-cover"
                />

                {/* Pricing Section */}
                <div className="flex flex-col px-5 gap-4">
                    {
                        couponData ? (
                            <>
                                <p className="text-2xl font-bold flex items-center gap-3">${discountedPrice.finalPrice ? discountedPrice.finalPrice : course.pricing}
                                    <s className="text-sm text-muted-foreground font-semibold">${discountedPrice.originalPrice}</s>
                                    <span className="text-sm font-normal font-serif">{couponData?.discountType === 'fixed' ? `$${couponData.discount} flat` : `${couponData?.discount}%`} off</span>
                                </p>
                                {
                                    couponData.autoApply &&
                                    <p className="italic text-red-500 flex items-center gap-1">
                                        {
                                            (couponData.onlyFor === 'tier_1' || couponData.onlyFor === 'tier_2') &&
                                            <AlertCircle size={14} />
                                        }
                                        {couponData.onlyFor === 'tier_1' ? `Exclusive ${couponData?.discountType === 'fixed' ? `$${couponData.discount} flat off for new users` : `${couponData?.discount}% off for new users`} ` : null}
                                    </p>
                                }
                            </>
                        ) : (
                            <p className="text-2xl font-bold flex items-center">${course.pricing}</p>
                        )

                    }

                    {/* Add to Cart */}
                    {cartItemsId?.has(id) ? (
                        <Button
                            variant="outline"
                            className="border-purple-500 h-13 text-purple-700 font-bold text-md hover:text-purple-700 cursor-pointer"
                            onClick={() => navigate("/cart")}
                        >
                            View in Cart
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            className="border-purple-500 h-13 text-purple-700 font-bold text-md hover:text-purple-700 cursor-pointer"
                            onClick={() => handleAddToCart(course)}
                            disabled={isFetchingCartItems}
                        >
                            Add to Cart
                        </Button>
                    )}

                    {/* Buy Now */}
                    <Button
                        variant="outline"
                        className="border-purple-500 h-13 text-purple-700 font-bold text-md hover:text-purple-700 cursor-pointer"
                        onClick={handleBuyNow}
                    >
                        Buy Now
                    </Button>

                    {/* Extra Info */}
                    <p className="text-muted-foreground text-[14px] text-center">
                        30-Day Money-Back Guarantee
                    </p>
                    <p className="text-muted-foreground text-[12px] text-center">
                        Full Lifetime Access
                    </p>

                    {/* Actions */}
                    <div className="flex underline underline-offset-2 w-full h-full">
                        <Button variant="outline" className="hover:bg-gray-200 border-none">
                            Share
                        </Button>
                        <Button variant="outline" className="hover:bg-gray-200 border-none">
                            Gift This Course
                        </Button>
                        <Button
                            variant="outline"
                            className="hover:bg-gray-200 border-none"
                        // onClick={() => refetch()}
                        >
                            Apply Coupon
                        </Button>
                    </div>

                    {/* Coupon Section */}
                    {couponData ? (
                        <Card className="border-2 border-dotted text-[#9194ac] text-[13px] p-2 px-4 gap-1 rounded-none">
                            <p><span className="font-bold">{couponData.code}</span> is applied</p>
                            <p>Udemy Coupon</p>
                        </Card>
                    ) : (
                        <Card className="border-2 border-dotted bg-muted text-muted-foreground text-sm text-center p-4 rounded-none">
                            No Coupon is Applied
                        </Card>
                    )}

                    <div className="flex gap-2 mt-2">
                        <Input className="rounded-sm border-gray-400" ref={inputRef}

                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    // refetch()
                                    handleValidateCoupon()

                                }
                            }}
                        />
                        <Button
                            className={`rounded-sm ${isCouponApplyLoading ? "cursor-progress" : "cursor-pointer"
                                }`}
                            disabled={isCouponApplyLoading}
                            onClick={() => {
                                // refetch()
                                setIsCouponApplyLoading(true)
                                handleValidateCoupon()
                            }}
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Student_CourseDetailsPricing;
