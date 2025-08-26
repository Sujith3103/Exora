import { Card } from "@/components/ui/card"
import type { ClickEvent } from "@/config/config"
import { trackClick } from "@/services/userService"
import type { RootState } from "@/store"
import type { CourseSummary } from "@/store/courseCatalogSlice"
import { useSelector } from "react-redux"

const CourseList = () => {

    const courseCatalog = useSelector((state: RootState) => state.courseCatalog.data)
    const user = useSelector((state:RootState) => state.auth.user)

    const handleClick_ClickEvent = async(course:CourseSummary) => {
        try{
            if(!user) return 
            const clickEvent:ClickEvent = {
                userId:user?.id.toString(),
                type:'course',
                targetId:course.id,
                categoryId:course.category,
                instructorId:course.instructor.id        
            }
            trackClick(clickEvent)
        }catch(err){
            console.log(err)
        }
    }

    return (
        <div className='mt-5 flex-1'>
            {
                courseCatalog.map(course => (
                    <>
                        <Card className="flex flex-row gap-0 w-full sm:p-4 pb-0 pt-0 border-0  shadow-none">
                            <div className="flex-shrink-0 w-[35%] max-w-[311px] xl:max-w-[311px]">
                                <img src={course.thumbnailUrl} className="w-full h-auto object-cover border cursor-pointer" 
                                onClick={() =>handleClick_ClickEvent(course)}
                                />
                            </div>
                            <div className="flex flex-col ml-3 gap-[2px]">
                                <p className="font-bold line-clamp-2 cursor-pointer"  onClick={() => handleClick_ClickEvent(course)}>{course.title}</p>
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
