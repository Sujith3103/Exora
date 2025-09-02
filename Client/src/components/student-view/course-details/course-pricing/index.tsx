import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CoursePricingSkeleton } from './course-pricing-Skeleton'
import { useCourseDetails } from '@/hooks/queries/useCourseDetails'
import { useCart } from '@/hooks/queries/useCart'
import useCartMutation from '@/hooks/mutations/useCartMutation'
import { addCartItemToDb } from '@/lib/indexdb'
import type { RootState } from '@/store'
import type { CourseDetails } from '@/store/courseDetailsSlice'
import type { CartItem } from '@/store/cartSlice'

const Student_CourseDetailsPricing = () => {
    const [cartItemsId, setCartitemsId] = useState<Set<string>>()

    const { data: itemsInCart } = useCart()
    const { id } = useParams<string>()
    const { addToCart } = useCartMutation()
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

    const navigate = useNavigate()

    // Load cart item ids
    useEffect(() => {
        if (itemsInCart?.data) {
            const itemsIds = new Set(itemsInCart.data.map((item: any) => item.courseId))
            setCartitemsId(itemsIds as Set<string>)
        }
    }, [itemsInCart])

    // Handle add to cart
    const handleClick_addToCart = async (course: CourseDetails) => {
        if (!course.thumbnailUrl) return

        const item: CartItem = {
            title: course.title,
            courseId: course.id,
            instructorName: course.instructor.name,
            price: course.pricing,
            thumbnailUrl: course.thumbnailUrl,
            status: 'ACTIVE',
            addedAt: Date.now(),
        }

        if (isAuthenticated) {
            addToCart.mutate(item)
        } else {
            addCartItemToDb(item)
        }
    }

    if (!id) return null

    const { data, isLoading } = useCourseDetails(id)
    const course = data?.data

    if (isLoading) {
        return <CoursePricingSkeleton />
    }

    return (
        <div className="sticky top-0 p-5 h-full">
            <Card className="h-full gap-0 pt-0 rounded-none">
                {/* Course Thumbnail */}
                <img
                    src={course?.thumbnailUrl}
                    loading="eager"
                    className="p-3 border-b min-w-full min-h-[200px] max-h-[220px] object-cover"
                />

                {/* Course Pricing Section */}
                <div className="flex flex-col p-5 gap-4">
                    <span className="text-2xl font-bold">${course?.pricing}</span>

                    {/* Add to Cart */}
                    {cartItemsId?.has(id) ? (
                        <Button
                            variant="outline"
                            className="border-purple-500 h-13 text-purple-700 font-bold text-md hover:text-purple-700 cursor-pointer"
                            onClick={() => navigate('/cart')}
                        >
                            View in Cart
                        </Button>
                    ) : (

                        <Button
                            variant="outline"
                            className="border-purple-500 h-13 text-purple-700 font-bold text-md hover:text-purple-700 cursor-pointer"
                            onClick={() => handleClick_addToCart(course!)}
                        >
                            Add to Cart
                        </Button>

                    )}

                    {/* Buy Now */}
                    <Button
                        variant="outline"
                        className="border-purple-500 h-13 text-purple-700 font-bold text-md hover:text-purple-700 cursor-pointer"
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

                    {/* Action Buttons */}
                    <div className="flex underline underline-offset-2 w-full h-full">
                        <Button variant="outline" className="hover:bg-gray-200 cursor-pointer hover:rounded-sm border-none">
                            Share
                        </Button>
                        <Button variant="outline" className="hover:bg-gray-200 cursor-pointer hover:rounded-sm border-none">
                            Gift This Course
                        </Button>
                        <Button variant="outline" className="hover:bg-gray-200 cursor-pointer hover:rounded-sm border-none">
                            Apply Coupon
                        </Button>
                    </div>

                    {/* Coupon Section */}
                    <Card className="border-2 border-dotted bg-muted text-muted-foreground text-sm text-center p-4 rounded-none">
                        No Coupon is Applied
                    </Card>
                    <div className="flex gap-2 mt-2">
                        <Input className="rounded-sm border-gray-400" />
                        <Button className="rounded-sm">Apply</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default Student_CourseDetailsPricing
