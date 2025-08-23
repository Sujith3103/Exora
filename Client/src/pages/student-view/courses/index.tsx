import { useQuery } from "@tanstack/react-query";
import { fetchCourses } from "@/hooks/useCourse";

export default function StudentViewCourses({
  category,
  page,
}: {
  category: string;
  page: number;
}) {
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["courses", category, page, limit], // ✅ unique key for caching
    queryFn: () => fetchCourses({ category, page, limit }),
    keepPreviousData: true, // ✅ smooth pagination (keeps old data until new arrives)
    staleTime: 1000 * 60, // ✅ cache for 1 min before re-fetch
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
          onClick={() => (window.location.href = `/courses?category=${category}&page=${page - 1}&limit=${limit}`)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          disabled={page === data.totalPages}
          onClick={() => (window.location.href = `/courses?category=${category}&page=${page + 1}&limit=${limit}`)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
