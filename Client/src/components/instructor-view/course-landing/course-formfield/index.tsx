import { Label } from '@/components/ui/label';
import Editor from '../../text-editor/Editor';
import { Input } from '@/components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { setCourseInformation, type CourseInfo } from '@/store/courseSlice';
// import { renderTiptapJSONtoHTML } from '../../text-editor/renderHTML';

// 🔑 Extract only string-based keys from CourseInfo
type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export type CourseFormFieldType<K extends StringKeys<CourseInfo> = StringKeys<CourseInfo>> = {
  id: K;
  name: K;
  label: string;
  type: "input" | "editor";
  placeholder: string;
  helperText: string;
  maxLength?: number;
  minLength?: number;
  minWords?: number;
};

const CourseFormField = () => {
  const courseData = useSelector((state: RootState) => state.course.courseInformation);
  const dispatch = useDispatch<AppDispatch>();
  // let htmlContent;
  // if (courseData?.description) {
  //   htmlContent = renderTiptapJSONtoHTML(JSON.parse(courseData?.description))
  // }

  // ✅ these fields are typed safely
  const courseFormFields = [
    {
      id: "title",
      name: "title",
      label: "Course Title",
      type: "input",
      placeholder: "Enter your course title",
      helperText:
        "Your title should be a mix of attention-grabbing, informative, and optimized for search",
      maxLength: 60,
      minLength: 10,
    },
    {
      id: "subtitle",
      name: "subtitle",
      label: "Course Subtitle",
      type: "input",
      placeholder: "Insert your course subtitle",
      helperText:
        "Use 1 or 2 related keywords, and mention 3-4 of the most important areas that you've covered during your course.",
      maxLength: 120,
      minLength: 20,
    },
    {
      id: "description",
      name: "description",
      label: "Course Description",
      type: "editor",
      placeholder: "Write a detailed description of your course",
      helperText: "Description should have minimum 200 words.",
      minWords: 200,
    },
  ] as const satisfies CourseFormFieldType[];

  const handleChange = <K extends StringKeys<CourseInfo>>(
    e: React.ChangeEvent<HTMLInputElement>,
    field: CourseFormFieldType<K>
  ) => {
    dispatch(
      setCourseInformation({
        key: field.id as keyof CourseInfo, // ✅ widened so Redux accepts it
        value: e.target.value,
        fromServer: false,
      })
    );
  };

  return (
    <>
      {courseFormFields.map((field) => (
        <div className="mt-2" key={field.id}>
          <Label className="font-bold text-[15px]">{field.label}</Label>

          {field.type === "editor" ? (
            <Editor placeholder={field.placeholder} />
          ) : (
            <div className="relative mt-2">
              <Input
                value={courseData?.[field.id] ?? ""} // ✅ type-safe lookup
                name={field.name}
                className="w-full pr-16 border-gray-400"
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                onChange={(e) => handleChange(e, field)}
              />
              {field.maxLength && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  Max: {field.maxLength}
                </span>
              )}
            </div>
          )}

          <p className="text-muted-foreground mt-2 text-[13px]">
            {field.helperText}
          </p>
        </div>
      ))}
      {/* <div
        className="prose [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1"
        dangerouslySetInnerHTML={{ __html: htmlContent || "" }}
      ></div> */}
    </>
  );
};

export default CourseFormField;
