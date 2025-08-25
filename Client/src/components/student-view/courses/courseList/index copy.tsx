import { Card } from "@/components/ui/card";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";

const CourseList = () => {
  const courseCatalog = useSelector((state: RootState) => state.courseCatalog.data);

  return (
    <div className="mt-5 flex flex-col gap-4">
      {courseCatalog.map((course, index) => (
        <div key={course.id || index} className="w-full">
          <Card className="flex flex-col md:flex-row gap-4 w-full p-4 border-0 shadow-none">

            {/* Responsive Image starting from XL fixed width */}
            <div className="flex-shrink-0 w-full md:w-[40%] max-w-[311px] xl:max-w-[311px]">
              <div className="relative w-full pb-[56.25%] overflow-hidden rounded">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="flex flex-col gap-1 flex-1">
              <p className="font-bold text-lg">{course.title}</p>
              <p className="text-sm text-gray-600">{course.subtitle}</p>
              <p className="text-[12px] text-muted-foreground">Instructor Name</p>
              <div className="mt-2">Ratings</div>
              <div>Duration and total lectures</div>
            </div>

            {/* Pricing */}
            <span className="mt-2 md:mt-0 md:ml-auto font-bold text-lg">${course.pricing}</span>
          </Card>

          {/* Divider */}
          {index < courseCatalog.length - 1 && (
            <div className="p-4">
              <hr className="border-gray-300" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseList;
