"use server";

import connectToDB from "@/lib/mongodb";
import Lesson from "@/lib/modal/Lesson";
import Student from "@/lib/modal/Student";
import User from "@/lib/modal/User";

// Fetch lesson by ID
export async function fetchLessonById(lessonId) {
  await connectToDB();
  
  try {
    const lesson = await Lesson.findById(lessonId)

    if (!lesson) {
      throw new Error("Lesson not found");
    }

    return JSON.parse(JSON.stringify(lesson)); // Convert Mongoose object to plain JS object
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return null;
  }
}


//Update lesson details
export async function updateLesson(lessonId, updatedData) {
  await connectToDB();
  

  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, updatedData, {
      new: true, // Return the updated document
      runValidators: true,
    });

    return JSON.parse(JSON.stringify(updatedLesson)); // Convert to plain JS object
  } catch (error) {
    console.error("Error updating lesson:", error);
    throw new Error("Failed to update lesson");
  }
}

//Fetch all lessons assigned by a teacher
export async function fetchLessonsByTeacher(teacherId) {
    await connectToDB();
  
    try {
        // Get all lessons assigned by this teacher
        const lessons = await Lesson.find({ teacher: teacherId }).sort({ createdAt: -1 });

        // Manually fetch student details for each lesson
        const lessonsWithStudent = await Promise.all(
        lessons.map(async (lesson) => {
            if (!lesson.student) {
            return { ...lesson.toObject(), studentName: "Unknown Student" };
            }

            // Fetch student name from the `User` model
            const studentData = await User.findById(lesson.student).select("name");

            return {
            ...lesson.toObject(),
            studentName: studentData ? studentData.name : "Unknown Student",
            };
        })
        );

        return lessonsWithStudent;
    } catch (error) {
      console.error("Error fetching lessons:", error);
      return [];
    }
}