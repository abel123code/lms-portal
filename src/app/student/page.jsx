import React from "react";
import { fetchLessonsByStudent } from "./actions";
import BriefAssignmentCard from "./BriefAssignmentCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function StudentPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "student") {
    return <p className="text-center text-red-500">Unauthorized access</p>;
  }

  const lessons = await fetchLessonsByStudent(session.user.id); 
  
  return (
    <div className="mx-auto p-6 bg-muted min-h-screen w-full">
      <h1 className="text-2xl font-semibold mb-4">My Lessons</h1>

      {lessons.length === 0 ? (
        <p className="text-center text-gray-600">No lessons assigned yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson) => (
            <BriefAssignmentCard
              key={lesson._id}
              lessonId={lesson._id}
              title={lesson.title}
              teacherName={lesson.teacherName} 
              teacherEmail={lesson.teacherEmail}
              createdAt={new Date(lesson.createdAt).toLocaleDateString()}
              completed={lesson.completed}
            />
          ))}
        </div>
      )}
    </div>
  );
}
