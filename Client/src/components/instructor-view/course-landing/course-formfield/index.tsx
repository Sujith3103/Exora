import { Label } from '@/components/ui/label';
import Editor from '../../text-editor/Editor';
import { Input } from '@/components/ui/input';

const CourseFormField = () => {

    const courseFormFields = [
        {
            id: "title",
            name: "title",
            label: "Course Title",
            type: "input", // input, textarea, editor etc
            placeholder: "Enter your course title",
            helperText: "Your title should be a mix of attention-grabbing, informative, and optimized for search",
            maxLength: 60,
            minLength: 10,
        },
        {
            id: "course-subtitle",
            name: "courseubStitle",
            label: "Course Subtitle",
            type: "input",
            placeholder: "Insert your course subtitle",
            helperText: "Use 1 or 2 related keywords, and mention 3-4 of the most important areas that you've covered during your course.",
            maxLength: 120,
            minLength: 20,
        },
        {
            id: "description",
            name: "description",
            label: "Course Description",
            type: "editor", // rich text editor
            placeholder: "Write a detailed description of your course",
            helperText: "Description should have minimum 200 words.",
            minWords: 200,
        }
    ];
    return (
        <>
            {
                courseFormFields.map(field => (
                    <div className="mt-2" key={field.id}>
                        <Label className="font-bold text-[15px]">{field.label}</Label>
                        {
                            field.type === "editor" ? (
                                <Editor placeholder={field.placeholder} />
                            ) : (
                                <div className="relative mt-2">
                                    <Input
                                        name={field.name}
                                        className="w-full pr-16 border-gray-400"
                                        placeholder={field.placeholder}
                                        maxLength={field.maxLength}
                                    />
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                        Max: {field.maxLength}
                                    </span>
                                </div>
                            )
                        }
                        <p className="text-muted-foreground mt-2 text-[13px]">{field.helperText}</p>
                    </div>
                ))
            }
        </>
    )
}

export default CourseFormField
