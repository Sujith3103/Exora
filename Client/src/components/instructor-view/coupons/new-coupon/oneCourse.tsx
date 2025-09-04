"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Drawer,
    DrawerContent,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useCourseTitles } from "@/hooks/queries/useCourseTitls"
import { useMediaQuery } from "./useMediaQuery"

type Course = {
    id: string
    title: string
}

export function SelectOneCourse({
    value,
    onChange,
}: {
    value: string | undefined
    onChange: (val: string) => void
}) {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    const { data: CourseTitles, isLoading, error } = useCourseTitles()

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>Failed to load courses</p>

    // find currently selected course from value
    const selectedCourse = CourseTitles.find((c: any) => c.id === value) || null

    const handleSelect = (course: Course) => {
        onChange(course.id) // ✅ update form state
        setOpen(false)
    }

    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                        <span className="truncate">
                            {selectedCourse ? selectedCourse.title : "+ Select course"}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                    <CourseList courses={CourseTitles} onSelect={handleSelect} />
                </PopoverContent>
            </Popover>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                    <span className="truncate">
                        {selectedCourse ? selectedCourse.title : "+ Select course"}
                    </span>
                </Button>
            </DrawerTrigger>
            <DrawerTitle>Select a course</DrawerTitle>
            <DrawerContent>
                <div className="mt-4 border-t">
                    <CourseList courses={CourseTitles} onSelect={handleSelect} />
                </div>
            </DrawerContent>
        </Drawer>
    )
}

function CourseList({
    courses,
    onSelect,
}: {
    courses: Course[]
    onSelect: (course: Course) => void
}) {
    return (
        <Command>
            <CommandInput placeholder="Search courses..." />
            <CommandList>
                <CommandEmpty>No courses found.</CommandEmpty>
                <CommandGroup>
                    {courses.map((course) => (
                        <CommandItem
                            key={course.id}
                            value={course.title}
                            onSelect={() => onSelect(course)}
                        >
                            {course.title}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}
