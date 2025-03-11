"use server";

import connectToDB from "@/lib/mongodb";
import Lesson from "@/lib/modal/Lesson";
import Student from "@/lib/modal/Student";
import User from "@/lib/modal/User";
import s3 from "@/lib/s3";
import { z } from "zod";

const BUCKET = process.env.AWS_S3_BUCKET;

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
// export async function updateLesson(lessonId, updatedData) {
//   await connectToDB();
  

//   try {
//     const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, updatedData, {
//       new: true, // Return the updated document
//       runValidators: true,
//     });

//     return JSON.parse(JSON.stringify(updatedLesson)); // Convert to plain JS object
//   } catch (error) {
//     console.error("Error updating lesson:", error);
//     throw new Error("Failed to update lesson");
//   }
// }

export async function updateLesson(formData) {
  "use server";
  console.log('formdata in updatelesson:::', formData);

  // 1) Extract the fields from FormData
  const lessonId = formData.get("lessonId")?.toString() || "";
  const title = formData.get("title")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const videoUrl = formData.get("videoUrl")?.toString() || "";
  const completed = formData.get("completed") === "true";
  const oldPdfKey = formData.get("oldKey")?.toString() || "";
  const newFile = formData.get("newFile");
  console.log('server action newFile:::', newFile);

  // 2) Validate with Zod or similar
  // This is just a minimal example
  // (You could do a more thorough Zod schema check here)
  if (!lessonId || !title) {
    throw new Error("Lesson ID & title are required");
  }

  // 3) Connect to DB & fetch current lesson
  await connectToDB();
  const existingLesson = await Lesson.findById(lessonId);
  if (!existingLesson) {
    throw new Error("Lesson not found");
  }

  // 4) If there's a new PDF file, let's do the S3 replacement
  let newPdfKey = existingLesson.pdfKey; // keep old if no new file
  if (newFile && newFile.size > 0) {
    // Delete the old object if oldPdfKey is provided
    if (oldPdfKey) {
      try {
        await s3.deleteObject({ Bucket: BUCKET, Key: oldPdfKey }).promise();
        console.log("Deleted old PDF from S3:", oldPdfKey);
      } catch (err) {
        console.error("Error deleting old PDF:", err);
        // Decide if you want to fail or just log
      }
    }

    // Upload the new file
    try {
      const fileName = newFile.name;
      const fileType = newFile.type;
      const timeSuffix = Date.now();

      // Convert the Blob to a Node.js buffer
      const arrayBuffer = await newFile.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);

      newPdfKey = `assignments/${lessonId}/${timeSuffix}_${fileName}`;
      const uploadParams = {
        Bucket: BUCKET,
        Key: newPdfKey,
        Body: fileBuffer,
        ContentType: fileType,
        // ACL: "public-read" if you want a permanent public URL
      };

      await s3.upload(uploadParams).promise();
      console.log("Uploaded new PDF to S3:", newPdfKey);
    } catch (uploadErr) {
      console.error("Error uploading new PDF:", uploadErr);
      throw new Error("Failed to upload new PDF to S3");
    }
  }

  // 5) Update the Lesson doc in DB
  existingLesson.title = title;
  existingLesson.description = description;
  existingLesson.videoUrl = videoUrl;
  existingLesson.completed = completed;
  existingLesson.pdfKey = newPdfKey; // store new PDF Key (if changed)
  // ... update other fields as needed (quiz, teacher, etc.)

  await existingLesson.save();

  // 6) (Optionally) generate a new presigned URL if you want to store it
  // Keep in mind it expires.
  // If you prefer it private, just store the pdfKey and generate a
  // presigned link on demand. But here we show how if you want to store it:
  const signedUrl = s3.getSignedUrl("getObject", {
    Bucket: BUCKET,
    Key: existingLesson.pdfKey,
    Expires: 60 * 60, // 1 hour
  });
  existingLesson.pdfUrl = signedUrl;
  await existingLesson.save();

  // 7) Return the updated lesson
  return JSON.parse(JSON.stringify(existingLesson));
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