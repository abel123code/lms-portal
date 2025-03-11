"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { fetchStudentsByTeacher } from "@/app/actions/teacherActions";
import { assignLessonAction } from "./actions"; // <-- Import the server action
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { BookCheck } from "lucide-react";
import { toast } from "sonner";
import { Upload, File, X } from 'lucide-react'
import LessonPageHeader from "@/components/LessonPageHeader";

// Zod schema for quiz questions
const quizQuestionSchema = z.object({
  question: z.string().min(1, "Question required"),
  options: z.array(z.string().min(1)).min(2, "At least 2 options required"),
  correctAnswer: z.string().min(1, "Correct answer required"),
});

// Entire form schema (CLIENT SIDE) ignoring actual file uploads
const lessonFormSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  videoFile: z.any().optional(), // We'll ignore file in the server action
  videoUrl: z.string().optional(),
  quiz: z.array(quizQuestionSchema).optional(),
  assignmentFile: z.any().optional(),
});

export default function AssignLessonPage() {
  const { data: session } = useSession();
  const [students, setStudents] = useState([]);
  const [fileName, setFileName] = useState(null);
  const router = useRouter();

  // Fetch students when teacher ID is available
  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        try {
          const studentsList = await fetchStudentsByTeacher(session.user.id);
        
          setStudents(studentsList);
        } catch (error) {
          console.error("Failed to fetch students:", error);
        }
      }
    };
    fetchData();
  }, [session]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: { quiz: [] },
  });

  const { fields: quizFields, append: appendQuiz, remove: removeQuiz } = useFieldArray({
    name: "quiz",
    control,
  });

  // On form submit
  const onSubmit = async (data) => {
    // We'll create a FormData object for the server action
    const formData = new FormData();
    formData.append("teacherId", session?.user?.id || "");
    formData.append("studentId", data.studentId);
    formData.append("title", data.title);
    formData.append("description", data.description || "");

    // For now, ignoring file. But let's store it if we want it later
    // if (data.videoFile?.length) {
    //   formData.append("videoFile", data.videoFile[0]);
    // } else {
    //   formData.append("videoUrl", data.videoUrl || "");
    // }

    // Since you're skipping S3, let's always rely on the videoUrl
    formData.append("videoUrl", data.videoUrl || "");

    // Convert the quiz array to a JSON string
    formData.append("quiz", JSON.stringify(data.quiz || []));

    // Add the PDF file if it exists
    if (data.assignmentFile?.length) {
      formData.append("assignmentFile", data.assignmentFile[0]); // single PDF
    }

    try {
      const lessonId = await assignLessonAction(formData);
      toast(`Lesson assigned successfully!`);
      router.push('/teacher');
    } catch (err) {
      console.error("Error assigning lesson:", err);
      toast("Error assigning lesson");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 shadow-lg rounded-md mt-4">
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 pb-4 rounded-sm mb-2">
        <div className="flex items-center gap-2 flex-col">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
            <BookCheck className="h-4 w-4 text-gray-900" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Assign New Lesson</h3>
          <p className="text-sm text-gray-600">Create a new lesson for a student</p>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Student Select */}
        <div>
          <label className="block font-medium mb-1">Select Student</label>
          <select className="w-full p-2 border rounded-md" {...register("studentId")}>
            <option value="">-- Select Student --</option>
              {Array.isArray(students) ? (
                students.map((s) => (
                  <option key={s.userId} value={s.userId}>{s.name}</option>
                ))
              ) : (
                <option disabled>{students.error || "No students available"}</option>
              )}
          </select>
          {errors.studentId && <p className="text-red-500 text-sm">{errors.studentId.message}</p>}
        </div>

        {/* Lesson Title */}
        <div>
          <label className="block font-medium mb-1">Lesson Title</label>
          <input
            type="text"
            placeholder="e.g., Algebra Introduction"
            className="w-full p-2 border rounded-md"
            {...register("title")}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description (optional)</label>
          <textarea
            className="w-full p-2 border rounded-md"
            rows={3}
            placeholder="Briefly describe what this lesson covers..."
            {...register("description")}
          />
        </div>

        {/* Video Upload or URL */}
        <div>
          <label className="block font-medium mb-1">Video File or URL</label>
          <p className="text-xs text-gray-500 mb-2">
            Currently ignoring file upload. Provide a YouTube/external link below.
          </p>
          {/* For later use if implementing S3:
          <input type="file" className="mb-2" {...register("videoFile")} /> */}

          <input
            type="text"
            placeholder="e.g., https://youtube.com/..."
            className="w-full p-2 border rounded-md"
            {...register("videoUrl")}
          />
        </div>

        {/* PDF Assignment File Upload */}
        <div>
          <label className="block font-medium mb-1">Assignment PDF</label>
          <p className="text-xs text-gray-500 mb-2">
            Upload a PDF that the student can download as homework instructions.
          </p>
          {/* File Upload Field */}
          <label
            htmlFor="assignmentFile"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100
                      text-gray-700 rounded cursor-pointer hover:bg-gray-200"
          >
            <Upload className="text-gray-500" size={18} />
            <span>Upload PDF</span>
            {/* Hide the real file input, but still register it with react-hook-form */}
            <input
              id="assignmentFile"
              type="file"
              accept="application/pdf"
              className="hidden"
              {...register("assignmentFile", {
                onChange: (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFileName(file.name);
                  }
                },
              })}
            />
            {fileName && (
              <div className="mt-2 flex items-center space-x-2 text-gray-700">
                <File className="text-red-500" size={18} />
                <p className="text-sm">{fileName}</p>
              </div>
            )}
          </label>
          {errors.assignmentFile && (
            <p className="text-red-500 text-sm">{errors.assignmentFile.message}</p>
          )}
        </div>

        {/* Quiz (Dynamic Fields) */}
        <div>
          <label className="block font-medium mb-2">Quiz (Optional)</label>
          <p className="text-sm text-gray-500 mb-4">
            Add multiple-choice questions or leave blank if no quiz. Select the correct option!
          </p>

          {quizFields.map((field, index) => (
            <div key={field.id} className="border rounded-md p-3 mb-2">
              {/* Question Input */}
              <label className="block font-medium">Question</label>
              <input
                type="text"
                placeholder="e.g., What is 2+2?"
                className="w-full p-2 border rounded-md mb-2"
                {...register(`quiz.${index}.question`)}
              />

              {/* Options */}
              <label className="block font-medium mb-1">Options</label>
              {Array.from({ length: 4 }).map((_, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder={`Option ${optIndex + 1}`}
                    className="w-full p-2 border rounded-md"
                    {...register(`quiz.${index}.options.${optIndex}`)}
                  />
                  {/* Radio button for selecting correct answer */}
                  <input
                    type="radio"
                    value={optIndex} // The value is the index of the option
                    {...register(`quiz.${index}.correctAnswer`)}
                  />
                </div>
              ))}

              {/* Remove Question Button */}
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeQuiz(index)}
              >
                Remove Question
              </Button>
            </div>
          ))}

          {/* Add Question Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendQuiz({ question: "", options: ["", "", "", ""], correctAnswer: "0" })}
          >
            Add Quiz Question
          </Button>
        </div>

        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </div>
  );
}
