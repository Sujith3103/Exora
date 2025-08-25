import { Card } from "@/components/ui/card"
import type { RootState } from "@/store"
import { useSelector } from "react-redux"

const CourseList = () => {

    const courseCatalog = useSelector((state: RootState) => state.courseCatalog.data)

    return (
        <div className='mt-5 flex-1'>
            {
                courseCatalog.map(course => (
                    <>
                        <Card className="flex flex-row gap-0 w-full sm:p-4 pb-0 pt-0 border-0  shadow-none">
                            <div className="flex-shrink-0 w-[35%] max-w-[311px] xl:max-w-[311px]">
                                <img src={course.thumbnailUrl} className="w-full h-auto object-cover border" />
                            </div>
                            <div className="flex flex-col ml-3 gap-[2px]">
                                <p className="font-bold line-clamp-2">{course.title}</p>
                                <p className="text-sm line-clamp-2">{course.subtitle}</p>
                                <p className="text-[12px] text-muted-foreground">Instructor Name</p>
                                <div>
                                    Ratings
                                </div>
                                <div className="line-clamp-1">
                                    Duration and total lectures
                                </div>
                            </div>
                            <span className="ml-auto font-bold">${course.pricing}</span>
                        </Card>
                        <div className="p-1/2">
                            <hr className="border-gray-300" />
                        </div>
                    </>
                ))
            }
        </div>
    )
}

export default CourseList
