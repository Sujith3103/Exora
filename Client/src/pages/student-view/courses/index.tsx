import { fetchCourses } from "@/hooks/useCourse";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function StudentViewCourses({
  category,
  page,
}: {
  category: string;
  page: number;
}) {
  const limit = 10;
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["courses", category, page, limit],
    queryFn: () => fetchCourses({ category, page, limit }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60, // cache 1 min
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading courses</p>;

  return (
    <div className="p-4">
      <h2 className="font-semibold mb-2">
        {category.replace("-", " ")} Courses
      </h2>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.data.map((course: any) => (
          <li
            key={course.id}
            className="border rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <h3 className="font-medium">{course.title}</h3>
            <p className="text-sm text-gray-600">{course.description}</p>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex gap-2 mt-4">
        <button
          disabled={page === 1}
          onClick={() =>
            navigate(`/courses?category=${category}&page=${page - 1}&limit=${limit}`)
          }
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          disabled={page === data.totalPages}
          onClick={() =>
            navigate(`/courses?category=${category}&page=${page + 1}&limit=${limit}`)
          }
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
