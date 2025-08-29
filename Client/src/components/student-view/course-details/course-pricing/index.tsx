import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { CoursePricingSkeleton } from './course-pricing-Skeleton'

const Student_CourseDetailsPricing = () => {

    const course = useSelector((state: RootState) => state.courseCatalogDetails.data)
    const isLoading = useSelector((state:RootState) => state.courseCatalogDetails.loading)

    if(isLoading){
        return <CoursePricingSkeleton />
    }
    
    return (
        <div className='sticky top-0 p-5 h-full'>
            <Card className='h-full gap-0 pt-0 rounded-none'>
                <img src={course?.thumbnailUrl} loading='eager' className='p-2 border-b min-w-full min-h-[200px] max-h-[220px] object-cover'/>
                <div>
                    {/* something */}
                </div>
                <div className='flex flex-col p-5 gap-4'>
                    <span className='text-2xl font-bold'>${course?.pricing}</span>
                    <Button variant={'outline'} className='border-purple-500 h-13 text-purple-700 font-bold text-md hover:text-purple-700 cursor-pointer'>Add to Cart</Button>
                    <Button variant={'outline'} className='border-purple-500 h-13 text-purple-700 font-bold text-md hover:text-purple-700 cursor-pointer'>buy Now</Button>
                    <p className='text-muted-foreground text-[14px] text-center'>30-Day Money-Back Guarantee</p>
                    <p className='text-muted-foreground text-[12px] text-center'>Full Lifetime Access</p>
                    <div className='flex underline  w-full h-full'>
                        <Button variant={'outline'} className='hover:bg-gray-200 cursor-pointer hover:rounded-sm border-none'>Share</Button>
                        <Button variant={'outline'} className='hover:bg-gray-200 cursor-pointer hover:rounded-sm border-none'>Gift This Course</Button>
                        <Button variant={'outline'} className='hover:bg-gray-200 cursor-pointer hover:rounded-sm border-none'>Apply Coupon</Button>
                    </div>
                    <Card className="border-2 border-dotted bg-muted text-muted-foreground text-sm text-center p-4 rounded-none">
                        No Coupon is Applied
                    </Card>
                    <div className='flex gap-2 mt-2'>
                        <Input className='rounded-sm'/>
                        <Button className='rounded-sm'>Apply</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default Student_CourseDetailsPricing
