import LearningPage from "./LearningPage";
import { fetchLessonsByStudent } from "../actions";
import Lesson from "@/lib/modal/Lesson";

export default async function LessonPage({ params }) {
  const { LessonId } = params; 

  const lessonData = await Lesson.findById(LessonId).lean();

  if (!lessonData) {
    return <h1 className="text-center justify-center flex">Lesson not found.</h1>;
  }

  return <LearningPage lessonData={JSON.parse(JSON.stringify(lessonData))} />;
}
