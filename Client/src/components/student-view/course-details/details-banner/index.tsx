import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { Skeleton } from '@/components/ui/skeleton'
import { useCourseDetails } from '@/hooks/queries/useCourseDetails'
import { BadgeCheckIcon, Verified } from 'lucide-react'
import { useParams } from 'react-router-dom'


const CourseDetailsBanner = () => {

    // const courseDetails = useSelector((state: RootState) => state.courseCatalogDetails.data)
    // const isLoading = useSelector((state: RootState) => state.courseCatalogDetails.loading)
    // const isError = useSelector((state: RootState) => state.courseCatalogDetails.error)

    const { id } = useParams<string>()

    if (!id) return
    const { data, isError, isLoading } = useCourseDetails(id)
    const courseDetails = data?.data

    if (isLoading || isError) {
        return (
            <div className='relative  w-full'>
                <Spinner size={100} variant='circle' className='text-white ml-[30%] mt-[9%]' />
                {
                    isError && <div className='ml-[30%] mt-6'>
                        <Button className='w-30 bg-[#5022c3] hover:bg-[#5022c3] cursor-pointer text-white' onClick={() => useCourseDetails(id)}>Retry</Button>
                    </div>
                }
                <Card className="w-[48%] h-25 absolute ml-[13%] -bottom-13 flex flex-row gap-4  p-0 rounded-sm overflow-hidden shadow-lg">
                    <div className="bg-[#5022c3] w-32 h-full flex flex-col justify-center items-center text-white p-2">
                    </div>
                    
                    <div className='flex flex-col flex-1 justify-center items-center gap-5'>
                        <Skeleton className='w-[80%] h-4 bg-neutral-300'></Skeleton>
                        <Skeleton className='w-[75%] h-4 bg-neutral-300'></Skeleton>        
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <>
            <div className='text-white p-5 flex-wrap pl-40 w-[60%] relative space-y-5'>
                <nav aria-label="Breadcrumb" className="text-purple-300 text-sm font-semibold mt-2">
                    <ol className="flex space-x-2">
                        <li><a href="#" className="hover:underline">Development</a></li>
                        <li><span>›</span></li>
                        <li><a href="#" className="hover:underline">Web Development</a></li>
                    </ol>
                </nav>
                <h1 className="text-4xl font-bold mt-1">{courseDetails?.title}</h1>
                <p className="text-xl">{courseDetails?.subtitle}</p>
                {/* <div>best seller? trending?</div> */}
                <p className="text-sm text-purple-300">Created by <a href="#" className="text-purple-400 hover:underline">Dr.{courseDetails?.instructor.name}, {courseDetails?.instructor.profession || 'Developer and Lead Instructor'}</a></p>
                {/* <p className="">Created By <span className="underline text-[#c0c4fc]">{courseDetails?.instructor.name}</span></p> */}
                <Badge
                    variant="secondary"
                    className="bg-blue-500 text-white dark:bg-blue-600"
                >
                    <BadgeCheckIcon />
                    Verified
                </Badge>                <div className="flex items-center mt-2 text-sm text-gray-300">
                    <span>Last updated {courseDetails?.updatedAt}</span>
                    <span className="ml-4">🌐 {courseDetails?.primaryLanguage}</span>
                </div>
                <Card className="w-[80%] h-25 ml-[4%] absolute -bottom-13 flex flex-row items-center gap-0 p-0 rounded-sm overflow-hidden shadow-lg">
                    {/* Premium Badge */}
                    <div className="bg-[#5022c3] w-32 h-full flex flex-col justify-center items-center text-white p-2">
                        <Verified className="w-6 h-6 mb-1" />
                        <p className="text-sm font-semibold">Premium</p>
                    </div>

                    {/* Description */}
                    <div className="flex-1 h-full flex items-center px-4 text-sm text-gray-800">
                        Boost your skills with this top-rated course! Dive in now to unlock all content.
                    </div>

                    {/* Ratings */}
                    <div className="flex-1 h-full flex flex-col justify-center items-center border-l border-gray-300 ">
                        ⭐ 4.8
                        <span className="text-md text-gray-500">Ratings</span>
                    </div>

                    {/* Learners */}
                    <div className="flex-1 h-full flex flex-col justify-center items-center border-l border-gray-300">
                        👨‍🎓 12,345
                        <span className=" text-gray-500">Learners</span>
                    </div>
                </Card>

            </div>

        </>
    )
}

export default CourseDetailsBanner
