import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CirclePlay, FileTextIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const NewContent = () => {
    const [isVisible, setIsVisible] = useState(false)

    const inputRefVideo = useRef<HTMLInputElement>(null)
    const inputRefPdf = useRef<HTMLInputElement>(null)

    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const selectedFile = e.target.files?.[0];
    //     if (selectedFile) {
    //         setFile(selectedFile);
    //         console.log("Selected PDF:", selectedFile);
    //     }
    // };

    useEffect(() => {
        setIsVisible(true) // triggers animation after mount
    }, [])

    return (
        <Card
            className={`flex flex-col items-center rounded-none p-3 justify-center border-dashed border-gray-300 mt-2 gap-3
        transition-all duration-300 ease-out
        ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}
        >
            <p className="text-gray-500 mb-0">
                Select the main type of content. Files and links can be added as resources.
            </p>
            <div className="flex p-0 gap-10">
                <Card onClick={() => inputRefVideo.current?.click()} className="w-19 h-15 flex cursor-pointer flex-col items-center rounded-none border border-gray-300 gap-1 group p-0 hover:bg-gray-300 transition-colors duration-300">
                    <CirclePlay size={23} className="p-0 mt-3 mb-0" strokeWidth={1} />
                    <Input ref={inputRefVideo} className="hidden" type="file" accept="video/*" />
                    <span className="text-[11px] text-center w-full h-5 flex items-center justify-center bg-gray-300 group-hover:bg-purple-400 group-hover:text-white transition-colors duration-300">
                        Video
                    </span>
                </Card>

                <Card onClick={() => inputRefPdf.current?.click()}
                    className="w-19 h-15 flex cursor-pointer flex-col items-center rounded-none border border-gray-300 gap-1 group p-0 hover:bg-gray-300 transition-colors duration-300">
                    <FileTextIcon size={23} className="p-0 mt-3 mb-0" strokeWidth={1} />
                    <Input ref={inputRefPdf} className="hidden" type="file" accept="application/pdf" />
                    <span className="text-[11px] text-center w-full h-5 flex items-center justify-center bg-gray-300 group-hover:bg-purple-400 group-hover:text-white transition-colors duration-300">
                        PDF
                    </span>
                </Card>
            </div>
        </Card>
    )
}

export default NewContent
