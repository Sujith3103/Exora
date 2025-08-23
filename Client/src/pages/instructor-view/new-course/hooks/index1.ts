import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import server from "@/api/axiosinstance";
import type { AppDispatch, RootState } from "@/store";
import {
  courseSliceLoadingStart,
  courseSliceLoadingStop,
  setCourseInformation,
  setCourseSection
} from "@/store/courseSlice";

export function useNewCourse() {
  const dispatch = useDispatch<AppDispatch>();
  const courseData = useSelector((state: RootState) => state.course.courseInformation);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const fetchComponentInUrl = () => location.pathname.split("/")[4];

  const handleClick_saveChanges = async () => {
    if (!id) return;
    const response = await server.put(`/course/${id}/landing`, {
      courseInformation: courseData
    });
    if (response.data.success) {
      console.log("updated course", response.data);
    }
  };

  const fetchCourseLanding = async () => {
    if (!id) return;
    dispatch(courseSliceLoadingStart());
    const valInTab = fetchComponentInUrl();
    if (valInTab !== "course-landing") {
      dispatch(courseSliceLoadingStop());
      return;
    }

    const response = await server.get(`/course/${id}/landing`);
    if (response.data.success) {
      dispatch(setCourseInformation({ fromServer: true, data: response.data.course }));
    }
    dispatch(courseSliceLoadingStop());
    console.log(response.data);
  };

  const fetchSectionsWhenIdle = () => {
    if (!id) return;
    if ("requestIdleCallback" in window) {
      requestIdleCallback(async () => {
        console.log("fetching sections");
        dispatch(courseSliceLoadingStart());
        const response = await server.get(`/course/get-all-sections/${id}`);
        if (response.data.success) {
          console.log("fetched sections", response.data);
          dispatch(setCourseSection(response.data.sections));
        }
        dispatch(courseSliceLoadingStop());
      });
    } else {
      setTimeout(fetchSectionsWhenIdle, 0);
    }
  };

  useEffect(() => {
    fetchCourseLanding();
    fetchComponentInUrl();
    fetchSectionsWhenIdle();
  }, [id, location.pathname]);

  return {
    courseData,
    navigate,
    fetchComponentInUrl,
    handleClick_saveChanges
  };
}
