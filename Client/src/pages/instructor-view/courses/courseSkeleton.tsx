import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";

const CourseSkeleton = () => (
  <TableRow className="animate-pulse">
    <TableCell>
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 bg-gray-300 rounded" />
        <div className="h-4 w-32 bg-gray-300 rounded"></div>
      </div>
    </TableCell>
    <TableCell className="text-center">
      <div className="h-4 w-20 bg-gray-300 mx-auto rounded"></div>
    </TableCell>
    <TableCell className="text-center">
      <div className="h-4 w-16 bg-gray-300 mx-auto rounded"></div>
    </TableCell>
    <TableCell className="text-center">
      <div className="h-4 w-12 bg-gray-300 mx-auto rounded"></div>
    </TableCell>
    <TableCell className="text-center">
      <div className="h-4 w-16 bg-gray-300 mx-auto rounded"></div>
    </TableCell>
    <TableCell className="text-center">
      <div className="h-4 w-20 bg-gray-300 mx-auto rounded"></div>
    </TableCell>
    <TableCell className="text-center flex justify-center gap-3">
      <div className="h-4 w-4 bg-gray-300 rounded"></div>
      <div className="h-4 w-4 bg-gray-300 rounded"></div>
    </TableCell>
  </TableRow>
);

const InstructorCoursesSkeleton = () => {
  const skeletonArray = Array.from({ length: 3 }); // number of rows

  return (
    <div className="w-full h-full p-5 flex flex-col">
      <h1 className="text-3xl font-semibold mb-5">
        <div className="h-8 w-64 bg-gray-300 rounded animate-pulse" />
      </h1>

      <div className="w-full mt-5 mb-5 flex items-center gap-2">
        <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
        <div className="ml-auto h-8 w-24 bg-gray-300 rounded animate-pulse"></div>
      </div>

      <Table className="table-auto w-full">
        <TableCaption>
          <div className="h-4 w-48 bg-gray-300 rounded mx-auto animate-pulse" />
        </TableCaption>
        <TableHeader>
          <TableRow>
            {["Course", "Category", "Duration", "Price", "Level", "Status", "Config"].map((head) => (
              <TableHead key={head}>
                <div className="h-4 w-20 bg-gray-300 rounded mx-auto animate-pulse" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {skeletonArray.map((_, idx) => (
            <CourseSkeleton key={idx} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InstructorCoursesSkeleton;
