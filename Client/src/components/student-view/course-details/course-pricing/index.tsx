import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CoursePricingSkeleton } from "./course-pricing-Skeleton";

import { useCourseDetails } from "@/hooks/queries/useCourseDetails";
import { useCart } from "@/hooks/queries/useCart";
import useCartMutation from "@/hooks/mutations/useCartMutation";
import useCouponMutation from "@/hooks/mutations/useCouponMutation";
import usePurchaseMutation from "@/hooks/mutations/usePurchaseMutation";

import { addCartItemToDb, getCartItemsFromIDB } from "@/lib/indexdb";
import type { RootState } from "@/store";
import type { CourseDetails } from "@/store/courseDetailsSlice";
import type { CartItem } from "@/store/cartSlice";


// ─── Types ──────────────────────────────────────────────

type ValidateCouponProps = {
    courseId: string;
    instructorId: string;
    coupon: string;
    isAuthenticated: boolean;
    userId: string;
    isApplying? : boolean
};

type Coupon = {
    id: string;
    title: string;
    code: string;
    discountType: "percentage" | "fixed";
    discount: number;
    noOfCoupons: number;
    limitPerUser: number;
    onlyFor: "tier_1" | "tier_2" | "tier_3" | "all";
    autoApply: boolean;
    timesUsed: number;
    totalRevenue: number;
    courseId: string;
    applyTo: "oneCourse" | "allCourses";
    validUntil: string;
    validFrom: string;
    userId: string;
};


// ─── Component ─────────────────────────────────────────

const Student_CourseDetailsPricing = () => {
    // ─── Hooks / Setup ───────────────────────────────────
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const inputRef = useRef<HTMLInputElement>(null);

    const params = searchParams.get("couponCode");

    const { data: itemsInCart, refetch, isLoading: isFetchingCartItems } = useCart();
    const { addToCart } = useCartMutation();
    const { data, isLoading } = useCourseDetails(id || "");
    const course = data?.data;
    const { validateCoupon, validateCouponOnLogin } = useCouponMutation();
    const { purchaseCourse } = usePurchaseMutation();

    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const userId = useSelector((state: RootState) => state.auth.user?.id);

    // ─── State ───────────────────────────────────────────
    const [cartItemsId, setCartItemsId] = useState<Set<string>>();
    const [isCouponApplyLoading, setIsCouponApplyLoading] = useState(false);
    const [isCouponFetching, setIsCouponFetching] = useState(true);
    const [couponData, setCouponData] = useState<Coupon>();
    const [discountedPrice, setDiscountedPrice] = useState({
        originalPrice: 0,
        discountApplied: 0,
        finalPrice: 0,
    });


    // ─── Handlers ────────────────────────────────────────

    /** Handle Buy Now */
    const handleBuyNow = async () => {
        if (!course) return;

        if (!isAuthenticated) {
            return navigate(`/auth/login?redirect=/course/${course.id}`);
        }

        if (couponData) {
            const finalPrice = calculateCouponDiscount(course.pricing, couponData);
            purchaseCourse.mutate({
                courseId: course.id,
                ...finalPrice,
            });
        }
    };

    /** Fetch cart items for both logged in / guest */
    async function fetchCartItems() {
        if (isAuthenticated) {
            const ids = new Set(itemsInCart.data.map((item: any) => item.courseId));
            setCartItemsId(ids as Set<string>);
        } else {
            const data = await getCartItemsFromIDB();
            const ids = new Set(data.map((item: any) => item.courseId));
            setCartItemsId(ids);
        }
    }

    /** Add course to cart */
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
        fetchCartItems();
    };

    /** Calculate price after coupon discount */
    const calculateCouponDiscount = (coursePrice: number, coupon: Coupon) => {
        let finalPrice = coursePrice;

        if (coupon.discountType === "percentage") {
            finalPrice = coursePrice - (coursePrice * coupon.discount) / 100;
        } else if (coupon.discountType === "fixed") {
            finalPrice = coursePrice - coupon.discount;
        }

        if (finalPrice < 0) finalPrice = 0;

        setDiscountedPrice({
            originalPrice: coursePrice,
            discountApplied: coursePrice - finalPrice,
            finalPrice,
        });

        return {
            originalPrice: coursePrice,
            discountApplied: coursePrice - finalPrice,
            finalPrice,
        };
    };

    /** Validate coupon */
    const handleValidateCoupon = (isApplying:boolean) => {
        const couponCode =
            inputRef.current?.value || searchParams.get("couponCode") || "";

        const validateCouponProps: ValidateCouponProps = {
            coupon: couponCode,
            courseId: course.id,
            instructorId: course.instructor.id,
            isAuthenticated,
            userId: userId as unknown as string,
            isApplying:isApplying
        };

        if (inputRef.current) {
            inputRef.current.value = "";
        }

        validateCoupon.mutate(validateCouponProps, {
            onSettled: (data) => {
                if (data.success) {
                    queryClient.setQueryData(
                        ["validate-coupon", data.data.userId, data.data.title],
                        data
                    );
                    setCouponData(data.data);
                    calculateCouponDiscount(course.pricing, data.data);

                    toast.dismiss();
                    toast.success(data.message, { style: { justifyContent: "center" }, duration: 2500 });

                    setSearchParams({ couponCode: data.data.code });
                } else {
                    toast.dismiss();
                    toast.error(data.message, { style: { justifyContent: "center" }, duration: 2000 });
                }
                setIsCouponApplyLoading(false);
                setIsCouponFetching(false);
            },
        });
    };


    // ─── Effects ─────────────────────────────────────────

    /** Fetch cart items */
    useEffect(() => {
        fetchCartItems();
    }, [itemsInCart]);

    /** Validate or auto-apply coupon */
    useEffect(() => {
        if (course?.id && params) {
            handleValidateCoupon(false);
        } else if (course?.id && !params) {
            setIsCouponFetching(true);

            validateCouponOnLogin.mutate(
                {
                    courseId: course.id,
                    instructorId: course.instructor.id,
                    userId: userId as unknown as string,
                    isAuthenticated,
                },
                {   
                    onSettled: (data) => {
                        if (data.success) {
                            setCouponData(data.data);
                            calculateCouponDiscount(course.pricing, data.data);
                            setSearchParams({ couponCode: data.data.code });
                        }
                        setIsCouponFetching(false);
                    },
                }
            );
        }
    }, [course]);

    /** Refetch cart on login */
    useEffect(() => {
        async function refetchCart() {
            if (isAuthenticated) {
                await refetch();
            }
        }
        refetchCart();
    }, [isAuthenticated]);

    // ─── Render ──────────────────────────────────────────

    if (!id) return null;
    if (isLoading || isCouponFetching) return <CoursePricingSkeleton />;
    if (!course) return null;

    return (
        <div className="sticky top-0 p-5 h-full">
            <Card className="h-full pt-0 rounded-none">

                {/* ─── Thumbnail ─── */}
                <img
                    src={course.thumbnailUrl}
                    loading="eager"
                    className="p-3 border-b min-w-full min-h-[200px] max-h-[220px] object-cover"
                />

                {/* ─── Pricing Section ─── */}
                <div className="flex flex-col px-5 gap-4">
                    {couponData ? (
                        <>
                            <p className="text-2xl font-bold flex items-center gap-3">
                                ${discountedPrice.finalPrice || course.pricing}
                                <s className="text-sm text-muted-foreground font-semibold">
                                    ${discountedPrice.originalPrice}
                                </s>
                                <span className="text-sm font-normal font-serif">
                                    {couponData.discountType === "fixed"
                                        ? `$${couponData.discount} flat`
                                        : `${couponData.discount}%`}{" "}
                                    off
                                </span>
                            </p>

                            {couponData.autoApply && (
                                <p className="italic text-red-500 flex items-center gap-1">
                                    {(couponData.onlyFor === "tier_1" ||
                                        couponData.onlyFor === "tier_2") && <AlertCircle size={14} />}
                                    {couponData.onlyFor === "tier_1"
                                        ? `Exclusive ${couponData.discountType === "fixed"
                                            ? `$${couponData.discount} flat off for new users`
                                            : `${couponData.discount}% off for new users`
                                        }`
                                        : null}
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="text-2xl font-bold flex items-center">${course.pricing}</p>
                    )}

                    {/* ─── Add To Cart ─── */}
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

                    {/* ─── Buy Now ─── */}
                    <Button
                        variant="outline"
                        className="border-purple-500 h-13 text-purple-700 font-bold text-md hover:text-purple-700 cursor-pointer"
                        onClick={handleBuyNow}
                    >
                        Buy Now
                    </Button>

                    {/* ─── Extra Info ─── */}
                    <p className="text-muted-foreground text-[14px] text-center">
                        30-Day Money-Back Guarantee
                    </p>
                    <p className="text-muted-foreground text-[12px] text-center">
                        Full Lifetime Access
                    </p>

                    {/* ─── Actions ─── */}
                    <div className="flex underline underline-offset-2 w-full h-full">
                        <Button variant="outline" className="hover:bg-gray-200 border-none">
                            Share
                        </Button>
                        <Button variant="outline" className="hover:bg-gray-200 border-none">
                            Gift This Course
                        </Button>
                        <Button variant="outline" className="hover:bg-gray-200 border-none">
                            Apply Coupon
                        </Button>
                    </div>

                    {/* ─── Coupon Section ─── */}
                    {couponData ? (
                        <Card className="border-2 border-dotted text-[#9194ac] text-[13px] p-2 px-4 gap-1 rounded-none">
                            <p>
                                <span className="font-bold">{couponData.code}</span> is applied
                            </p>
                            <p>Udemy Coupon</p>
                        </Card>
                    ) : (
                        <Card className="border-2 border-dotted bg-muted text-muted-foreground text-sm text-center p-4 rounded-none">
                            No Coupon is Applied
                        </Card>
                    )}

                    {/* ─── Coupon Input ─── */}
                    <div className="flex gap-2 mt-2">
                        <Input
                            className="rounded-sm border-gray-400"
                            ref={inputRef}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleValidateCoupon(true);
                                }
                            }}
                        />
                        <Button
                            className={`rounded-sm ${isCouponApplyLoading ? "cursor-progress" : "cursor-pointer"
                                }`}
                            disabled={isCouponApplyLoading}
                            onClick={() => {
                                setIsCouponApplyLoading(true);
                                handleValidateCoupon(true);
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
