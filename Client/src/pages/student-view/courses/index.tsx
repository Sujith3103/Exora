import CourseFilter from "@/components/student-view/courses/courseFilter";
import CourseList from "@/components/student-view/courses/courseList";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { courseCategories, type CourseQueryOptions } from "@/config/config";
import { useCourses } from "@/hooks/useCourse";
import { AlertCircleIcon, ListFilterIcon } from "lucide-react";
import { useState } from "react";

export default function StudentViewCourses(queryOptions: CourseQueryOptions) {

  const { data, isLoading, isError, isFetching } = useCourses(queryOptions)

  const [showCourseFilter, setShowFilter] = useState(false)


  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading courses</p>;
  if (isFetching) return <p>fetching</p>
  const courses = data?.data ?? [];

  return (
    <>
      <div className="p-10 flex flex-col">
        <p className="text-2xl font-serif font-bold">All {courseCategories.find(c => c.id === queryOptions.category)?.label ?? "Courses"} Courses</p>

        <Card className="flex flex-row gap-2 mt-2">
          <AlertCircleIcon className="ml-5" />
          <p>Not sure? All courses have a 30-day money-back guarantee</p>
        </Card>

        <div>
          <div className="flex gap-4 mt-5">
            <Button className="bg-white text-black hover:bg-white border border-gray-200 w-30 p-7"
              onClick={() => setShowFilter(prev => !prev)}
            ><ListFilterIcon /> Filter</Button>
            <Select>
              <SelectTrigger className="min-w-[8rem] w-auto p-7">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup defaultValue={"popular"}>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="highly-rated">Highly Rated</SelectItem>
                  <SelectItem value="highly-reviewed">None</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* total results */}
        </div>
        <div className="flex">
          {
            showCourseFilter && <CourseFilter />
          }
          <CourseList />
        </div>



      </div>
    </>
  );
}
