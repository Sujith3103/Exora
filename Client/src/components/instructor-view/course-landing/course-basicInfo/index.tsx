import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { courseCategories, courseLevelOptions, languageOptions } from '@/config/config'
import type { AppDispatch, RootState } from '@/store'
import { setCourseBasicInfo, setCousreLanding } from '@/store/courseSlice'
import { CircleQuestionMark } from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const basicInfo = [
    {
        id: 'primaryLanguage',
        name: 'primaryLanguage',
        label: "",
        placeholder: "--Language--",
        value: languageOptions
    },
    {
        id: 'level',
        name: 'Level',
        label: "",
        placeholder: "--Select Level--",
        value: courseLevelOptions
    },
    {
        id: 'category',
        name: 'Category',
        label: "",
        placeholder: "--Select Category--",
        value: courseCategories

    },
]

const CourseBasicInfo = () => {

    const dispatch = useDispatch<AppDispatch>()

    const basicinfoData = useSelector((state: RootState) => state.course.courseBasicInfo)
    const CourselandingState = useSelector((state: RootState) => state.course.CourseLanding)

    const handleChange_SearchKey = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setCousreLanding({key : 'searchKey', value: e.target.value}))
    }

    return (
        <>
            <div className="flex sm:flex-row flex-col sm:justify-evenly gap-5">
                {/* basic info */}
                {
                    basicInfo.map(field => (
                        <Select
                            value={basicinfoData[field.id] || ""}
                            key={field.id}
                            onValueChange={(val) =>
                                dispatch(setCourseBasicInfo({ key: field.id, value: val }))
                            }
                        >
                            <SelectTrigger className="sm:w-1/3 w-full rounded-sm border-gray-400">
                                <SelectValue placeholder={field.placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    field.value.map(item => (
                                        <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    ))
                }
            </div>

            <div className="flex flex-col mt-5">
                <div className="flex items-center">
                    <p className="font-semibold">What is primarily taught in your course?</p>

                    {/* tiny wrapper so hover area = icon */}
                    <span className="relative inline-block ml-2 group">
                        <CircleQuestionMark className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700" />

                        {/* tooltip anchored to icon; only shows when icon is hovered */}
                        <div className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                            <div className="relative bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 text-sm text-gray-800">

                                {/* left-pointing arrow centered vertically */}
                                <svg
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full"
                                    width="12"
                                    height="20"
                                    viewBox="0 0 12 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M12 0L0 10L12 20V0Z" fill="white" stroke="#D1D5DB" strokeWidth="1" />
                                </svg>


                                Each individual topic chosen should comprehensively describe your course's content without being too broad.
                                E.g. "The Complete React Course 2025" should have "React" — not "React Course" (specific, but not comprehensive)
                                and not "Development" (comprehensive, but not specific).
                            </div>
                        </div>
                    </span>
                </div>

                <Input placeholder="e.g. Landscape Photography" className="mt-3" value={CourselandingState?.searchKey} onChange={(e) => handleChange_SearchKey(e)}/>
            </div>
        </>
    )
}

export default CourseBasicInfo
