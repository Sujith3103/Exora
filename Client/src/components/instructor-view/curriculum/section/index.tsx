import server from '@/api/axiosinstance'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { AppDispatch } from '@/store'
import { updateCourseSection } from '@/store/courseSlice'
import { Label } from '@radix-ui/react-label'
import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
type NewSectionProps = {
    // isAddingSection: boolean;
    setIsAddingSection: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewSection: React.FC<NewSectionProps> = ({setIsAddingSection,}) => {

    const { id } = useParams<{ id: string }>();


    const initalInputRef = useRef<HTMLInputElement>(null)
    const dispatch = useDispatch<AppDispatch>()

    // const handleClick_AddNewSection = () => {
    //     const newSection: Section = {
    //         sectionTitle: '',
    //         order: sections.length + 1,
    //     }
    //     dispatch(setCourseSection(newSection))
    // }

    const handleClick_AddSection = async () => {
        if (initalInputRef.current) {
            const value = initalInputRef.current.value.trim()
            if (!value) return

            const response = await server.post(`/course/create-section/${id}`, { title: value })
            if (response.data.success) {
                dispatch(updateCourseSection(response.data.section))
                setIsAddingSection(false)
            }
            initalInputRef.current.value = "" // reset input
        }
    }

    useEffect(() => {
        initalInputRef.current?.focus()
    }, [])

    return (
        <Card className="p-5 border border-gray-300 rounded-md">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Label
                    htmlFor="section"
                    className="whitespace-nowrap font-medium text-gray-700"
                >
                    New Section:
                </Label>
                <Input
                    ref={initalInputRef}
                    name="section"
                    placeholder="Enter section title"
                    className="flex-1 border border-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 
                     focus:border-purple-500 "
                />
            </div>
            <Button
                className="w-full sm:w-auto bg-purple-700 hover:bg-purple-600 mt-4 ml-auto"
                onClick={handleClick_AddSection}
            >
                Add Section
            </Button>
        </Card>
    )
}

export default NewSection
