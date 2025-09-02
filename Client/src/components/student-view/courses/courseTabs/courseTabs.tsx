import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTrending } from "@/hooks/queries/useCourseTabs"
import { useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import Trending from "./trending/trending";
import Popular from "./popular/popular";


interface CourseTabData {
    thumbnailUrl: string;
    title: string;
    pricing: number;
    instructor: {
        name: string;
    } | null;  // null if no instructor
}

const CourseTabs = () => {

    const [searchParams] = useSearchParams()

    const category = searchParams.get('category')

    if (!category) return
    const { data: trending, isLoading, isError } = useTrending(category)

    console.log(trending)

    return (
        <div>
            <p className="font-bold text-2xl">Courses to get you Started</p>
            <p className="mt-2 text-muted-foreground font-semibold">Explore courses from experienced, real-world experts.</p>


            <Tabs className="mt-5" defaultValue="trending">
                <TabsList className="w-full flex justify-start border-b border-gray-300 rounded-none bg-transparent p-0">
                    <div>
                        <TabsTrigger
                            value="trending"
                            className="relative bg-transparent rounded-none border-none shadow-none px-4 py-2 text-gray-600 data-[state=active]:text-black 
                                data-[state=active]:font-semibold 
                                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-black after:transition-transform 
                                data-[state=active]:after:scale-x-100"
                        >
                            Trending
                        </TabsTrigger>
                        <TabsTrigger
                            value="popular"
                            className="relative bg-transparent rounded-none border-none shadow-none px-4 py-2 text-gray-600 data-[state=active]:text-black 
                            data-[state=active]:font-semibold 
                            after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-black after:transition-transform 
                            data-[state=active]:after:scale-x-100"
                        >
                            Popular
                        </TabsTrigger>
                        <TabsTrigger
                            value="new"
                            className="relative bg-transparent rounded-none border-none shadow-none px-4 py-2 text-gray-600 data-[state=active]:text-black 
                            data-[state=active]:font-semibold 
                            after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-black after:transition-transform 
                            data-[state=active]:after:scale-x-100"
                        >
                            New
                        </TabsTrigger>
                    </div>
                </TabsList>
                <TabsContent value="trending">
                    <Trending />
                </TabsContent>
                <TabsContent value="popular">
                    <Popular />
                </TabsContent>
                <TabsContent value="new">

                </TabsContent>

            </Tabs>


        </div>
    )
}

export default CourseTabs
