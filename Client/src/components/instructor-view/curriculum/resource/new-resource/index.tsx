import server from "@/api/axiosinstance"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AppDispatch } from "@/store"
import { setResource, type Lectures } from "@/store/courseSlice"
import { useDispatch } from "react-redux"

type NewResourceProp = {
    lecture: Lectures
    setShowResource: React.Dispatch<React.SetStateAction<{
        showRecourse: boolean,
        uploadRecourse: boolean,
        lecture: any
    }>>
}
// const [ShowResource, setShowResource] = useState<ShowResource>({
//         showRecourse: false,
//         uploadRecourse: false,
//         lecture: null
//     })
const NewResource = ({ lecture, setShowResource }: NewResourceProp) => {

    const dispatch = useDispatch<AppDispatch>()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const payload = {
            title: formData.get("title") as string,
            link: formData.get("link") as string
        };

        try {
            const response = await server.post(
                `/course/sections/${lecture.sectionId}/lectures/${lecture.id}/resources`,
                payload // 👈 send as JSON
            );
            if (response.data.success) {
                dispatch(setResource({ lectureId: lecture.id, sectionId: lecture.sectionId, resources: response.data.resource }))
            }
            setShowResource(prev => ({
                ...prev,
                uploadRecourse: false
            }))
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card className="mb-3 p-3 gap-3 border-gray-300 rounded-none border-0 border-t-1">
                <div className="w-full shadow-md rounded-none bg-white flex p-2 gap-5">
                    <div className="flex-1">
                        <Label htmlFor="title" className="mb-2">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            className="w-full border-1 p-2 px-5 border-gray-300 focus:border-purple-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-7 rounded-none transition-all duration-200"
                        />
                    </div>
                </div>

                <div className="w-full shadow-md rounded-none bg-white flex p-2 gap-5">
                    <div className="flex-1">
                        <Label htmlFor="link" className="mb-2">Link</Label>
                        <Input
                            id="link"
                            name="link"
                            className="w-full border-1 p-2 px-5 border-gray-300 focus:border-purple-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-7 rounded-none transition-all duration-200"
                        />
                    </div>
                </div>
                <div className="ml-auto gap-3 flex transition-all">
                    <Button className="w-30 bg-white text-purple-500 hover:bg-purple-100 border border-purple-500 text-center ml-auto"
                    onClick={() => setShowResource(prev => ({
                        ...prev,
                        showRecourse:true,
                        uploadRecourse:false
                    }))}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" className="w-30 bg-purple-600 hover:bg-purple-700 text-center ml-auto">
                        Add Resource
                    </Button>
                </div>
            </Card>
        </form>
    )
}

export default NewResource
