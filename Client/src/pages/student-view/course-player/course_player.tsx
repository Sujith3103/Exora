import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import server from "@/api/axiosinstance";

interface LectureAsset {
  id: string;
  url: string;
  type: "VIDEO" | "PDF";
  thumbnailUrl?: string;
}

interface Lecture {
  id: string;
  title: string;
  order: number;
  freePreview: boolean;
  lectureAssets?: LectureAsset;
  completed?: boolean;
}

interface Section {
  id: string;
  title: string;
  order: number;
  lectures: Lecture[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  sections: Section[];
}

const PING_INTERVAL_MS = 10_000;

const CoursePlayer: React.FC = () => {
  const { courseId, lectureId: routeLectureId } = useParams<{
    courseId: string;
    lectureId?: string;
  }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pingTimer = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // --- Fetch course & lectures
  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await server.get(`/course/${courseId}/learn`);
        const courseData = res.data.course;

        // Normalize lectures: add completed flag
        const normalizedSections = courseData.sections.map((s: Section) => ({
          ...s,
          lectures: s.lectures.map((l: Lecture & { progress?: { completed?: boolean } }) => ({
            ...l,
            completed: l.progress?.completed ?? false,
          })),
        }));

        setCourse({ ...courseData, sections: normalizedSections });

        // Set current lecture
        const allLectures = normalizedSections.flatMap((s:any) => s.lectures);
        if (allLectures.length === 0) return;

        if (routeLectureId) {
          const found = allLectures.find((l:any) => l.id === routeLectureId);
          setCurrentLecture(found || allLectures[0]);
          if (!found) navigate(`/course/${courseId}/learn/lecture/${allLectures[0].id}`, { replace: true });
        } else {
          setCurrentLecture(allLectures[0]);
          navigate(`/course/${courseId}/learn/lecture/${allLectures[0].id}`, { replace: true });
        }
      } catch (err) {
        console.error("Fetch course failed", err);
      }
    }
    if (courseId) fetchCourse();
  }, [courseId, routeLectureId]);

  // --- Restore progress for current lecture
  useEffect(() => {
    if (!currentLecture?.id || !courseId) return;
    async function restoreProgress() {
      try {
        const res = await server.get(`/progress/lecture/${currentLecture?.id}/status`);
        const watchedSec = res.data?.progress?.watchedSec ?? 0;
        if (watchedSec && videoRef.current) {
          videoRef.current.currentTime = watchedSec;
        }
      } catch {
        /* ignore */
      }
    }
    restoreProgress();
  }, [currentLecture?.id, courseId]);

  // --- Handle pinging and completion
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentLecture) return;

    const startPinging = () => {
      stopPinging();
      pingTimer.current = setInterval(async () => {
        try {
          const watchedSec = Math.floor(video.currentTime);
          await server.post(`/progress/lecture/${currentLecture.id}/ping`, {
            watchedSec,
            courseId,
          });
        } catch {}
      }, PING_INTERVAL_MS);
    };

    const stopPinging = () => {
      if (pingTimer.current) clearInterval(pingTimer.current);
      pingTimer.current = null;
    };

    const handlePlay = () => startPinging();
    const handlePause = () => stopPinging();
    const handleEnded = async () => {
      stopPinging();
      try {
        await server.post(`/progress/lecture/${currentLecture.id}/complete`, { courseId });

        // Update local state
        setCourse((prev) => {
          if (!prev) return prev;
          const newSections = prev.sections.map((s) => ({
            ...s,
            lectures: s.lectures.map((l) =>
              l.id === currentLecture.id ? { ...l, completed: true } : l
            ),
          }));
          return { ...prev, sections: newSections };
        });

        // Check if all lectures completed
        const allLectures = course?.sections.flatMap((s) => s.lectures) ?? [];
        const allDone = allLectures.every((l) => l.id === currentLecture.id ? true : l.completed);
        if (allDone) runWhenAllLecturesCompleted();
      } catch (err) {
        console.error("Complete error", err);
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      stopPinging();
    };
  }, [currentLecture?.id, courseId, course]);

  // --- All lectures completed callback
  function runWhenAllLecturesCompleted() {
    console.log("✅ User completed all lectures!");
    setShowCongrats(true);
    // You can add extra logic here (e.g., unlock certificate)
  }

  // --- Flatten lectures for easy reference
  const allLectures = course?.sections.flatMap((s) => s.lectures) ?? [];

  // --- Render
  if (!course) return <div className="text-center mt-10">Loading course...</div>;
  if (!currentLecture) return <div className="text-center mt-10">Please select a lecture</div>;

  // --- Progress calculation
  const totalLectures = allLectures.length;
  const completedLectures = allLectures.filter((l) => l.completed).length;
  const progressPercent = totalLectures ? Math.floor((completedLectures / totalLectures) * 100) : 0;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-1/4 overflow-y-auto bg-white border-r p-4">
        <h2 className="font-bold text-xl mb-2">{course.title}</h2>
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
        </div>
        {course.sections.map((section) => (
          <div key={section.id} className="mb-4">
            <h3 className="text-gray-700 font-semibold mb-2">{section.title}</h3>
            <div className="space-y-1">
              {section.lectures.map((lecture) => (
                <button
                  key={lecture.id}
                  onClick={() => {
                    setCurrentLecture(lecture);
                    navigate(`/course/${courseId}/learn/lecture/${lecture.id}`);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm flex justify-between items-center ${
                    currentLecture.id === lecture.id
                      ? "bg-blue-100 font-medium"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span>🎥 {lecture.title}</span>
                  {lecture.completed && <span className="text-green-600 font-bold">✔️</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </aside>

      {/* Video Player */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        {currentLecture.lectureAssets?.type === "VIDEO" ? (
          <video
            ref={videoRef}
            src={currentLecture.lectureAssets.url}
            controls
            className="w-full max-w-5xl rounded-lg shadow-lg bg-black"
          />
        ) : (
          <iframe
            src={currentLecture.lectureAssets?.url}
            className="w-full h-[70vh] rounded-lg shadow-lg bg-gray-100"
          />
        )}
        <h3 className="mt-4 text-lg font-semibold">{currentLecture.title}</h3>
      </main>

      {/* Congrats Modal */}
      {showCongrats && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-2">🎉 Congratulations!</h2>
            <p className="text-gray-700">You’ve completed the entire course!</p>
            <button
              onClick={() => setShowCongrats(false)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePlayer;
