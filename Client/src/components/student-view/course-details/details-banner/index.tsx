import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { RootState } from '@/store'
import { BadgeCheckIcon, Verified } from 'lucide-react'
import { useSelector } from 'react-redux'


const CourseDetailsBanner = () => {

    const courseDetails = useSelector((state: RootState) => state.courseCatalogDetails.data)


    return (
        <>
            <div className='text-white p-5 flex-wrap pl-40 w-[60%] relative space-y-4'>
                <h1 className="text-4xl font-bold mt-1">{courseDetails?.title}</h1>
                <p className="text-xl">{courseDetails?.subtitle}</p>
                {/* <div>best seller? trending?</div> */}
                <p className="">Created By <span className="underline text-[#c0c4fc]">{courseDetails?.instructor.name}</span></p>
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
                <Card className="w-[80%] h-25 absolute -bottom-13 flex flex-row items-center gap-0 p-0 rounded-xl overflow-hidden shadow-lg">
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
