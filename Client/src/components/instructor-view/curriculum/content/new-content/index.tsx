import server from "@/api/axiosinstance";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AppDispatch } from "@/store";
import { setLectureAsset, type LectureAsset, type Resources } from "@/store/courseSlice";
import { CirclePlay, FileTextIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

type Lectures = {
    id: string;
    sectionId: string;
    title: string;
    videoUrl: string;
    freePreview: boolean;
    lengthNum?: number;
    lengthStr?: string;
    order: number;
    lectureAssets?: LectureAsset;
    resources?: Resources[];
};

type ShowContent = {
    uploadingContent: boolean;
    selectingContent: boolean;
    LectureId: string | null;
};

type NewContentProps = {
    isfailed?: boolean
    lectureId: string;
    lectureData: Lectures;
    sectionId: string; // <--- required
    setShowContent: React.Dispatch<React.SetStateAction<ShowContent>>;
    showContent: ShowContent;
    setShowSubContent: React.Dispatch<React.SetStateAction<boolean>>;
};

const readable = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
}).format(new Date(new Date().toISOString()));

const NewContent = ({
    lectureId,
    lectureData,
    sectionId, // destructure
    showContent,
    setShowContent,
    setShowSubContent,
    isfailed
}: NewContentProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const inputRefVideo = useRef<HTMLInputElement>(null);
    const inputRefPdf = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();

    let lectureAsset: LectureAsset = {
        title: "",
        type: "",
        createdAt: readable,
        status: "pending",
        lectureId: "",
    };

    // Video upload handler
    const handleChange_VideoElement = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("type", "VIDEO");
        formData.append("title", selectedFile.name);

        lectureAsset = {
            ...lectureAsset,
            lectureId,
            status: "uploading",
            type: "VIDEO",
            title: selectedFile.name,
        };
        dispatch(setLectureAsset(lectureAsset));
        setShowContent((prev) => ({ ...prev, uploadingContent: true, selectingContent: false }));

        try {
            let response;
            if (lectureData.lectureAssets?.status === "published" || lectureData.lectureAssets?.status === 'failed' ) {
                response = await server.put(
                    `/media/course/${id}/lecture/${lectureId}/assets/${lectureData.lectureAssets.id}/edit`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
            } else {
                response = await server.post(
                    `/media/course/${id}/lecture/${lectureId}/assets`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
            }

            if (response.data.success) {
                lectureAsset = {
                    ...lectureAsset,
                    status: "published",
                    url: response.data.url,
                    publicId: response.data.public_id,
                };
                dispatch(setLectureAsset(lectureAsset));
                setShowContent((prev) => ({ ...prev, uploadingContent: false, selectingContent: false }));
                setShowSubContent(true);
            }
        } catch (err) {

            console.error("Video upload failed:", err);
            lectureAsset.status = "failed";
            dispatch(setLectureAsset(lectureAsset));
            setShowContent((prev) => ({ ...prev, uploadingContent: false, selectingContent: false }));
            sectionId
        }
    };

    // PDF upload handler
    const handleChange_PdfElement = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("type", "PDF");
        formData.append("title", selectedFile.name);

        lectureAsset = {
            ...lectureAsset,
            lectureId,
            status: "uploading",
            type: "PDF",
            title: selectedFile.name,
        };
        dispatch(setLectureAsset(lectureAsset));
        setShowContent((prev) => ({ ...prev, uploadingContent: true, selectingContent: false }));

        try {
            let response;
            if (lectureData.lectureAssets?.status === "published"|| lectureData.lectureAssets?.status === 'failed' ) {
                response = await server.put(
                    `/media/course/${id}/lecture/${lectureId}/assets/${lectureData.lectureAssets.id}/edit`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
            } else {
                response = await server.post(
                    `/media/course/${id}/lecture/${lectureId}/assets`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
            }

            if (response.data.success) {
                lectureAsset = {
                    ...lectureAsset,
                    status: "published",
                    url: response.data.url,
                    publicId: response.data.public_id,
                };
                dispatch(setLectureAsset(lectureAsset));
                setShowContent((prev) => ({ ...prev, uploadingContent: false, selectingContent: false }));
                setShowSubContent(true);
            }
        } catch (err) {
            console.error("PDF Upload failed:", err);
            lectureAsset.status = "failed";
            dispatch(setLectureAsset(lectureAsset));
            setShowContent((prev) => ({ ...prev, uploadingContent: true, selectingContent: false }));
        }
    };

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {

    })
    console.log(showContent.uploadingContent, isfailed)
    if (showContent.uploadingContent || isfailed) {
        return (
            <>
                <hr className="border border-gray-300 mt-2" />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>FileName</TableHead>
                            <TableHead className="text-center">type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>{lectureData.lectureAssets?.title}</TableCell>
                            <TableCell className="text-center">{lectureData.lectureAssets?.type}</TableCell>
                            <TableCell>{lectureData.lectureAssets?.status}</TableCell>
                            <TableCell className="text-center">{lectureData.lectureAssets?.createdAt}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </>
        );
    }

    else{
        console.log("nothing")
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
                <Card
                    onClick={() => inputRefVideo.current?.click()}
                    className="w-19 h-15 flex cursor-pointer flex-col items-center rounded-none border border-gray-300 gap-1 group p-0 hover:bg-gray-300 transition-colors duration-300"
                >
                    <CirclePlay size={23} className="p-0 mt-3 mb-0" strokeWidth={1} />
                    <Input
                        ref={inputRefVideo}
                        className="hidden"
                        type="file"
                        accept="video/*"
                        onChange={handleChange_VideoElement}
                    />
                    <span className="text-[11px] text-center w-full h-5 flex items-center justify-center bg-gray-300 group-hover:bg-purple-400 group-hover:text-white transition-colors duration-300">
                        Video
                    </span>
                </Card>

                <Card
                    onClick={() => inputRefPdf.current?.click()}
                    className="w-19 h-15 flex cursor-pointer flex-col items-center rounded-none border border-gray-300 gap-1 group p-0 hover:bg-gray-300 transition-colors duration-300"
                >
                    <FileTextIcon size={23} className="p-0 mt-3 mb-0" strokeWidth={1} />
                    <Input
                        ref={inputRefPdf}
                        className="hidden"
                        type="file"
                        accept="application/pdf"
                        onChange={handleChange_PdfElement}
                    />
                    <span className="text-[11px] text-center w-full h-5 flex items-center justify-center bg-gray-300 group-hover:bg-purple-400 group-hover:text-white transition-colors duration-300">
                        PDF
                    </span>
                </Card>
            </div>
        </Card>
    );
    }
};

export default NewContent;
