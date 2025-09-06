import CourseFilter from "@/components/student-view/courses/courseFilter";
import CourseList from "@/components/student-view/courses/courseList";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { courseCategories, type CourseQueryOptions } from "@/config/config";
import { useCourses } from "@/hooks/queries/useCourse";
import type { AppDispatch } from "@/store";
import { setCourseSummary, setPagination } from "@/store/courseCatalogSlice";
import { AlertCircleIcon, ListFilterIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CourseSkeleton from "./courseSkeleton";

export default function StudentViewCourses(queryOptions: CourseQueryOptions) {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading, isError, isFetching } = useCourses(queryOptions);

  const [showCourseFilter, setShowFilter] = useState(true);

  // keep state updates inside useEffect (prevents double dispatch)
  useEffect(() => {
    if (data) {
      dispatch(setCourseSummary(data.data));
      dispatch(
        setPagination({
          limit: data.limit,
          page: data.page,
          total: data.total,
          totalPages: data.totalPages,
        })
      );
    }
  }, [data, dispatch]);

  if (isLoading || isFetching) return <CourseSkeleton />;
  if (isError) return <p>Error loading courses</p>;

  return (
    <div className=" flex flex-col mt-15">
      {/* Title */}
      <p className="text-2xl font-serif font-bold">
        All {courseCategories.find((c) => c.id === queryOptions.category)?.label ?? "Courses"} Courses
      </p>

      {/* Guarantee Banner */}
      <Card className="flex flex-row gap-2 mt-2 items-center">
        <AlertCircleIcon className="ml-5" />
        <p>Not sure? All courses have a 30-day money-back guarantee</p>
      </Card>

      {/* Filter & Sort Controls */}
      <div className="flex gap-4 mt-5">
        <Button
          className="bg-white text-black hover:bg-neutral-100 border border-gray-200 w-30 p-7 cursor-pointer"
          onClick={() => setShowFilter((prev) => !prev)}
        >
          <ListFilterIcon /> Filter
        </Button>
        <Select>
          <SelectTrigger className="min-w-[8rem] w-auto p-7">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="highly-rated">Highly Rated</SelectItem>
              <SelectItem value="highly-reviewed">None</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Filter + Course List */}
      <div className="flex">
        {showCourseFilter && <CourseFilter />}
        <CourseList />
      </div>
    </div>
  );
}
