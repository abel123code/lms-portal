"use server";

import Lesson from "@/lib/modal/Lesson";
import User from "@/lib/modal/User"; // Use User model instead of Teacher
import connectToDB from "@/lib/mongodb";

// Fetch lessons for a specific student and retrieve teacher details from Users collection
export async function fetchLessonsByStudent(studentId) {
  await connectToDB();

  try {
    // Fetch lessons for the student
    const lessons = await Lesson.find({ student: studentId })
      .select("title createdAt completed teacher") // Get only required fields
      .lean();

    if (!lessons.length) return [];

    // Extract unique teacher IDs
    const teacherIds = [...new Set(lessons.map((lesson) => lesson.teacher?.toString()))];

    // Fetch teacher details from the Users collection
    const teachers = await User.find({ _id: { $in: teacherIds } })
      .select("name email")
      .lean();

    // Convert teacher data into a lookup map (id -> teacher details)
    const teacherMap = {};
    teachers.forEach((teacher) => {
      teacherMap[teacher._id.toString()] = teacher;
    });

    // Merge teacher details into lessons
    const lessonsWithTeacher = lessons.map((lesson) => ({
      ...lesson,
      teacherName: teacherMap[lesson.teacher]?.name || "Unknown Teacher",
      teacherEmail: teacherMap[lesson.teacher]?.email || "N/A",
    }));

    return JSON.parse(JSON.stringify(lessonsWithTeacher)); // Convert to plain JS objects
  } catch (error) {
    console.error("Error fetching lessons for student:", error);
    return [];
  }
}

export async function updateLesson(lessonId, updatedData) {
  await connectToDB();

  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, updatedData, {
      new: true,
      runValidators: true,
    });

    return JSON.parse(JSON.stringify(updatedLesson));
  } catch (error) {
    console.error("Error updating lesson:", error);
    throw new Error("Failed to update lesson");
  }
}