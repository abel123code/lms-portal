"use server";

import Lesson from "@/lib/modal/Lesson";
import User from "@/lib/modal/User"; // Use User model instead of Teacher
import connectToDB from "@/lib/mongodb";
import s3 from "@/lib/s3";

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

export async function getAssignmentDownloadUrl(lessonId) {
  "use server";

  await connectToDB();

  // 1) Fetch the lesson doc. We'll assume pdfKey is stored in it.
  const lesson = await Lesson.findById(lessonId);
  if (!lesson || !lesson.pdfKey) {
    throw new Error("No PDF found for this lesson");
  }

  // 2) Build the param object for getSignedUrl
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: lesson.pdfKey,          // e.g. "assignments/67bd5fa7/17416_algebra.pdf"
    Expires: 60 * 5,             // Link valid for 5 minutes (in seconds)
  };

  // 3) Generate the pre-signed URL
  const signedUrl = s3.getSignedUrl("getObject", params);

  // 4) Return it to the client
  return signedUrl;
}