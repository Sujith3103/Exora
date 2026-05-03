// import UploadImage from '../../../assets-static/placeholderuploadimage.webp'
import server from '@/api/axiosinstance'
import UploadImage from '../../../../assets-static/placeholderuploadimage.webp'
import Editor from '@/components/instructor-view/text-editor/Editor'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { courseCategories, courseLevelOptions, languageOptions } from '@/config/config'
import type { CourseInfo } from '@/store/courseSlice'
import { CircleQuestionMark, X } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useInstructorCourse } from '@/hooks/queries/instructor/useCourse'
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from '@/store'
import { addRequirement, removeRequirement, setCourseLanding, updateCourseLanding } from '@/store/insturctor/courseLandingSlice'

const courseFormFields = [
    {
        id: "title",
        name: "title",
        label: "Course Title",
        type: "input",
        placeholder: "Enter your course title",
        helperText:
            "Your title should be a mix of attention-grabbing, informative, and optimized for search",
        maxLength: 60,
        minLength: 10,
    },
    {
        id: "subtitle",
        name: "subtitle",
        label: "Course Subtitle",
        type: "input",
        placeholder: "Insert your course subtitle",
        helperText:
            "Use 1 or 2 related keywords, and mention 3-4 of the most important areas that you've covered during your course.",
        maxLength: 120,
        minLength: 20,
    },
    {
        id: "description",
        name: "description",
        label: "Course Description",
        type: "editor",
        placeholder: "Write a detailed description of your course",
        helperText: "Description should have minimum 200 words.",
        minWords: 200,
    }]

const basicInfo = [
    {
        id: 'primaryLanguage' as const,
        label: "Language",
        placeholder: "--Language--",
        value: languageOptions,
    },
    {
        id: 'level' as const,
        label: "Level",
        placeholder: "--Select Level--",
        value: courseLevelOptions,
    },
    {
        id: 'category' as const,
        label: "Category",
        placeholder: "--Select Category--",
        value: courseCategories,
    },
]

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const CourseLanding = () => {

    const dispatch = useAppDispatch();
    const courseLandingState = useAppSelector(
        (state) => state.courseLanding.data
    );
    const isInitialized = useAppSelector(
        (state) => state.courseLanding.isInitialized
    );
   

    const { id } = useParams<{ id: string }>();

    const { data: courseData } = useInstructorCourse({ courseId: id! })

    const requirementsInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: any, field: any) => {
        dispatch(
            updateCourseLanding({
                [field.id || field]: e.target.value,
            })
        );
    };
    const handleRemove = (index: number) => {
        dispatch(removeRequirement(index));
    };

    const handleChange_ImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        toast.loading("Image is being upload, please wait", { style: { justifyContent: "center" } })
        const file = e.target.files?.[0]
        if (!file) {
            return console.log("No file selected");
        }
        const formData = new FormData();
        formData.append("thumbnail", file);
        try {
            const res = await server.patch(`/media/course/${id}/thumbnail`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            if (res.data.success) {
                dispatch(
                    updateCourseLanding({
                        thumbnailUrl: res.data.url
                    })
                );

                toast.dismiss();
                toast.success("Image uploaded successfully", {
                    style: { justifyContent: "center" },
                    duration: 2000
                });
            }

        } catch (err) {
            console.error("Upload failed", err);
            toast.dismiss()
            toast.error("Failed to upload Image", { style: { justifyContent: "center" }, duration: 2000 })
        }

    }
    const handleClick_saveChanges = async () => {
        if (!courseLandingState) return;

        const response = await server.put(
            `/instructor/course/${id}/landing`,
            { courseInformation: courseLandingState }
        );

        if (response.data.success) {
            toast.success("Saved changes successfully");
        }
    };

    const handleAddRequirement = () => {
        const value = requirementsInputRef.current?.value.trim();
        if (!value) return;

        dispatch(addRequirement(value));

        if (requirementsInputRef.current) {
            requirementsInputRef.current.value = "";
        }
    };

    useEffect(() => {
        if (courseData && !isInitialized) {
            dispatch(setCourseLanding(courseData));
        }
    }, [courseData, isInitialized]);

    useEffect(() => {
        console.log("course : ", courseLandingState?.description)
    },[courseLandingState])

    return (
        <div>
            <Card className="p-10 flex flex-col rounded-none">
                <div className='flex'>
                    <h1 className="font-serif font- text-2xl font-bold">Course landing page</h1>
                    <Button className="ml-auto bg-white text-black border hover:bg-white cursor-pointer border-black" onClick={handleClick_saveChanges}>Save Changes</Button>
                </div>
                {courseFormFields.map((field) => (
                    <div className="mt-2" key={field.id}>
                        <Label className="font-bold text-[15px]">{field.label}</Label>

                        {field.type === "editor" ? (
                            <Editor
                                placeholder={field.placeholder}
                            />
                        ) : (
                            <div className="relative mt-2">
                                <Input
                                        value={
                                            courseLandingState?.[field.id as keyof CourseInfo] ?? ""
                                        }
                                    name={field.name}
                                    className="w-full pr-16 border-gray-400"
                                    placeholder={field.placeholder}
                                    maxLength={field.maxLength}
                                    onChange={(e) => handleChange(e, field)}
                                />
                                {field.maxLength && (
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                        Max: {field.maxLength}
                                    </span>
                                )}
                            </div>
                        )}
                        <p className="text-muted-foreground mt-2 text-[13px]">
                            {field.helperText}
                        </p>
                    </div>
                ))}
                <h3 className="text-md font-semibold ">Basic Info</h3>
                <div className="flex sm:flex-row flex-col sm:justify-evenly gap-5">
                    {basicInfo.map(field => (
                        <Select
                            key={field.id}
                            value={courseLandingState?.[field.id] || ""} // ✅ controlled
                            onValueChange={(val) => {
                                dispatch(
                                    updateCourseLanding({
                                        [field.id]: val
                                    })
                                );
                            }}
                        >
                            <SelectTrigger className="sm:w-1/3 w-full rounded-sm border-gray-400">
                                <SelectValue placeholder={field.placeholder} />
                            </SelectTrigger>

                            <SelectContent>
                                {field.value.map(item => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ))}
                </div>
                <div className="flex flex-col mt-5">
                    <div className="flex items-center">
                        <p className="font-semibold">What is primarily taught in your course?</p>

                        <span className="relative inline-block ml-2 group">
                            <CircleQuestionMark className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700" />
                            <div className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                                <div className="relative bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 text-sm text-gray-800">
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

                    <Input
                        placeholder="e.g. Landscape Photography"
                        className="mt-3"
                        value={courseLandingState?.searchkey || ""}
                        onChange={(e) => handleChange(e, 'searchkey')}
                    />
                </div>

                <div className="w-full max-w-lg mx-0">
                    <h3 className="text-lg font-semibold tracking-tight text-gray-800">
                        Course Requirements
                    </h3>

                    {/* List */}
                    <div className="space-y-3">
                        {courseLandingState?.requirements && courseLandingState.requirements.length > 0 ? (
                            courseLandingState.requirements.map((item: string, index: number) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition"
                                >
                                    <li className="text-gray-700 text-sm ml-2">{item}</li>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemove(index)}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 italic mt-4">
                                No requirements added yet.
                            </p>
                        )}
                    </div>

                    {/* Input */}
                    <div className="flex gap-3 mt-5">
                        <Input
                            // value={requirementsInputRef.current?.value}
                            ref={requirementsInputRef}
                            placeholder="Enter a requirement..."
                            className="flex-1"
                        />
                        <Button className="rounded-lg cursor-pointer" onClick={handleAddRequirement}>
                            Add
                        </Button>
                    </div>
                </div>

                {/* Pricing */}
                <div className="flex gap-2 mt-6 items-center ">
                    <Label className="text-lg font-semibold tracking-tight text-gray-800">
                        Pricing : $
                    </Label>
                    <Input
                        value={courseLandingState?.pricing ?? ""}
                        className='w-20'
                        type="number"
                        onChange={(e) =>
                            dispatch(
                                updateCourseLanding({
                                    pricing: e.target.value === "" ? 0 : Number(e.target.value),
                                })
                            )
                        }
                    />
                </div>

                <h3 className="text-md font-semibold ">Course Image</h3>
                <div className="flex">
                    <img src={courseLandingState?.thumbnailUrl ? courseLandingState?.thumbnailUrl : UploadImage} className="w-120 h-64 border border-gray-300" />
                    <div>
                        <p className="px-15 py-3 font-[Open_Sans]">Upload your course image here. It must meet our course image quality standards to be accepted. Important guidelines: 750x422 pixels; .jpg, .jpeg,. gif, or .png. no text on the image.</p>
                        <div className="flex px-20 py-7 gap-5">
                            <Input ref={inputRef} type="file" accept="image/*" onChange={(e) => handleChange_ImageUpload(e)} className="hidden" />
                            {
                                !courseLandingState?.thumbnailUrl ? <>
                                    <Input type="file" accept="image/*" />
                                    <Button className="bg-white text-blue-500 border border-blue-500 hover:bg-blue-50" onClick={() => inputRef.current?.click()}>Upload File</Button>
                                </>
                                    :
                                    <div className="flex items-center gap-10">
                                        <p>Edit File :</p>
                                        <Button className="bg-white text-blue-500 border border-blue-500 hover:bg-blue-50" onClick={() => inputRef.current?.click()}>Upload File</Button>
                                    </div>
                            }

                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default CourseLanding
