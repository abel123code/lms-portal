"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchLessonById, updateLesson } from "../actions";
import {
  Book,
  Save,
  Video,
  User,
  Users,
  CheckCircle,
  HelpCircle,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react";

// shadcn/ui
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// react-hook-form + zod
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonZodSchema, quizQuestionSchema } from "@/lib/schema/lessonSchema";

function getYoutubeEmbedUrl(url) {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : "";
}

export default function LessonForm() {
  const { lessonId } = useParams();
  const router = useRouter();

  // We’ll load the data into RHF when it arrives
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(lessonZodSchema),
    defaultValues: {
      _id: "",
      title: "",
      description: "",
      videoUrl: "",
      storageType: "",
      teacher: "",
      student: "",
      completed: false,
      quiz: [], 
    },
  });

  // We'll handle the dynamic quiz array with useFieldArray
  const { fields: quizFields, append, remove } = useFieldArray({
    control,
    name: "quiz",
  });

  // 1) Load data on mount
  useEffect(() => {
    const loadLesson = async () => {
      if (!lessonId) return;
      const lesson = await fetchLessonById(lessonId);
      if (!lesson) return; // handle error
      
      // Set form default values
      setValue("_id", lesson._id);
      setValue("title", lesson.title);
      setValue("description", lesson.description || "");
      setValue("videoUrl", lesson.videoUrl || "");
      setValue("storageType", lesson.storageType || "external");
      setValue("completed", lesson.completed || false);
      setValue("teacher", lesson.teacher || "");
      setValue("student", lesson.student || "");

      // set quiz
      setValue("quiz", lesson.quiz || []);
    };
    loadLesson();
  }, [lessonId, setValue]);

  const onSubmit = async (formData) => {
        console.log('Form Data Before Submission:', formData);

        // Ensure teacher and student IDs are preserved if they are not changed
        const updatedData = {
            title: formData.title,
            description: formData.description || "", // Ensure empty description is handled
            videoUrl: formData.videoUrl, // Required field
            storageType: formData.storageType || "external", // Default to "external" if missing
            completed: formData.completed,
            quiz: formData.quiz || [], // Default to empty array if no quiz

            // Ensure teacher and student IDs are kept if they already exist
            teacher: formData.teacher || null,
            student: formData.student || null,
        };

        try {
            // Call update function with updated data
            await updateLesson(lessonId, updatedData);

            toast("Lesson Updated");

            router.push("/teacher"); // Redirect to teacher's dashboard
        } catch (err) {
            console.error("Error updating lesson:", err);
            toast("Error Updating Lesson, try again later");
        }
    };


  // watchers for debugging
  const showData = watch();

  // The UI with Tabs
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl mx-auto">
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5 text-green-600" />
            <CardTitle>Edit Lesson</CardTitle>
          </div>
          <CardDescription>
            Update the lesson details, content, and quiz questions
          </CardDescription>
        </CardHeader>

        <Tabs defaultValue="details" className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Lesson Details</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="quiz">Quiz Questions</TabsTrigger>
            </TabsList>
          </div>

          {/* TAB: DETAILS */}
          <TabsContent value="details">
            <CardContent className="space-y-4 pt-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Lesson Title</Label>
                <Input
                  id="title"
                  placeholder="Enter lesson title"
                  required
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Enter detailed description"
                  {...register("description")}
                />
              </div>

              {/* Completed Switch */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="completed"
                  {...register("completed")}
                  // react-hook-form doesn't natively support a "checked" prop on Switch
                  // We can do it by using onCheckedChange or watch("completed").
                  // For simplicity, let's watch the value:
                  checked={showData.completed}
                  onCheckedChange={(val) => setValue("completed", val)}
                />
                <Label htmlFor="completed" className="flex items-center gap-2">
                  <CheckCircle
                    className={`h-4 w-4 ${
                      showData.completed ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                  Mark as completed
                </Label>
              </div>
            </CardContent>
          </TabsContent>

          {/* TAB: CONTENT */}
          <TabsContent value="content">
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="videoUrl" className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-gray-500" />
                  Video URL
                </Label>
                <Input
                  id="videoUrl"
                  placeholder="Enter YouTube video URL"
                  {...register("videoUrl")}
                />
                <div className="flex items-center text-xs text-gray-500 gap-1">
                  <ExternalLink className="h-3 w-3" />
                  <span>Storage Type: {showData.storageType || "external"}</span>
                </div>
              </div>

              {showData.videoUrl && (
                <div className="aspect-video w-full rounded-md overflow-hidden border border-gray-200">
                  <iframe
                    src={getYoutubeEmbedUrl(showData.videoUrl)}
                    title="Lesson Video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </CardContent>
          </TabsContent>

          {/* TAB: QUIZ */}
          <TabsContent value="quiz">
            <CardContent className="space-y-6 pt-4">
              {quizFields.map((field, questionIndex) => (
                <Card
                  key={field.id}
                  className="border border-gray-200"
                >
                  <CardHeader className="bg-gray-50 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-blue-600" />
                        <CardTitle className="text-base">
                          Question {questionIndex + 1}
                        </CardTitle>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(questionIndex)}
                        disabled={quizFields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Question</Label>
                      <Input
                        {...register(`quiz.${questionIndex}.question`)}
                        placeholder="Enter question"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Options</Label>
                      <RadioGroup
                        // watch correct answer
                        value={watch(`quiz.${questionIndex}.correctAnswer`)}
                        onValueChange={(val) =>
                          setValue(`quiz.${questionIndex}.correctAnswer`, val)
                        }
                        className="space-y-3"
                      >
                        {field.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={optIndex.toString()}
                              id={`q${questionIndex}-option-${optIndex}`}
                            />
                            <Input
                              {...register(`quiz.${questionIndex}.options.${optIndex}`)}
                              placeholder={`Option ${optIndex + 1}`}
                              className="flex-1"
                              required
                            />
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() =>
                  append({
                    question: "",
                    options: ["", "", "", ""],
                    correctAnswer: "0",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </CardContent>
          </TabsContent>
        </Tabs>

        <Separator />

        <CardFooter className="flex justify-end gap-2 py-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Lesson
              </div>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
