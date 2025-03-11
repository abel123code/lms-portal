import React from "react";
import { fetchLessonsByTeacher } from "./actions";
import BriefLessonCard from "./BriefLessonCard";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import LessonPageHeader from "@/components/LessonPageHeader";

export default async function TeacherPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "teacher") {
    return <p className="text-center text-red-500">Unauthorized access</p>;
  }

  const lessons = await fetchLessonsByTeacher(session.user.id);
  
  return (
    <div className=" mx-auto p-6 bg-muted min-h-screen w-full">
      <LessonPageHeader header={'My Assigned Lessons'} subheader={'Explore and manage your assigned lessons'} />

      {lessons.length === 0 ? (
        <p className="text-center text-gray-600">No lessons assigned yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson) => (
            <BriefLessonCard
              key={lesson._id}
              lessonId={lesson._id}
              title={lesson.title}
              studentName={lesson.studentName || "Unknown Student"}
              createdAt={new Date(lesson.createdAt).toLocaleDateString()}
              completed={lesson.completed}
            />
          ))}
        </div>
      )}
    </div>
  );
}
