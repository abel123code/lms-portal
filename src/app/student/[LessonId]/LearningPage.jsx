"use client";

import { useState } from "react";
import { CheckCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { updateLesson } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LearningPage({ lessonData }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
    const router = useRouter();
  // Convert YouTube URL to embedded format
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=))([^&?/]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    if (selectedAnswer === lessonData.quiz[0].correctAnswer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  // Updated: When marking as completed, update the lesson in DB and navigate to /student
  const handleMarkAsCompleted = async () => {
    try {
      // Update the lesson's completed status in the database
      await updateLesson(lessonData._id, { completed: true });
      toast("The lesson has been marked as completed.");
      router.push("/student");
    } catch (error) {
        console.error("Failed to mark lesson as completed:", error);
        toast("Failed to mark lesson as completed.");
    }
  };

  const resetQuiz = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{lessonData.title}</h1>
        </div>

        {/* Video Section */}
        <Card className="overflow-hidden border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <PlayCircle className="h-5 w-5 text-slate-600" />
              Video Lesson
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 aspect-video">
            <iframe
              src={getYoutubeEmbedUrl(lessonData.videoUrl)}
              className="w-full h-full"
              title={lessonData.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </CardContent>
        </Card>

        {/* Move Description Below Video */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-slate-800">
              Description
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-lg text-slate-600">{lessonData.description}</p>
          </CardContent>
        </Card>

        {/* Quiz Section */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-slate-800">Quiz</CardTitle>
            <CardDescription>Test your understanding of the lesson</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">{lessonData.quiz[0].question}</h3>
                <RadioGroup
                  value={selectedAnswer || ""}
                  onValueChange={setSelectedAnswer}
                  className="space-y-3"
                  disabled={isSubmitted && isCorrect}
                >
                  {lessonData.quiz[0].options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
                        isSubmitted && lessonData.quiz[0].correctAnswer === index.toString()
                          ? "border-green-200 bg-green-50"
                          : isSubmitted &&
                              selectedAnswer === index.toString() &&
                              selectedAnswer !== lessonData.quiz[0].correctAnswer
                            ? "border-red-200 bg-red-50"
                            : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <RadioGroupItem
                        value={index.toString()}
                        id={`option-${index}`}
                        className={
                          isSubmitted && lessonData.quiz[0].correctAnswer === index.toString() ? "text-green-600" : ""
                        }
                      />
                      <Label
                        htmlFor={`option-${index}`}
                        className={`w-full cursor-pointer ${
                          isSubmitted && lessonData.quiz[0].correctAnswer === index.toString()
                            ? "text-green-900"
                            : isSubmitted &&
                                selectedAnswer === index.toString() &&
                                selectedAnswer !== lessonData.quiz[0].correctAnswer
                              ? "text-red-900"
                              : "text-slate-900"
                        }`}
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {isSubmitted && (
                <Alert
                  className={
                    isCorrect ? "bg-green-50 text-green-900 border-green-200" : "bg-red-50 text-red-900 border-red-200"
                  }
                >
                  <AlertDescription>
                    {isCorrect ? "Correct! Great job!" : "Incorrect. Please try again."}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
            {isSubmitted ? (
              isCorrect ? (
                <div className="w-full">
                  <Button
                    onClick={handleMarkAsCompleted}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={isCompleted}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {isCompleted ? "Marked as Completed" : "Mark as Completed"}
                  </Button>
                </div>
              ) : (
                <Button onClick={resetQuiz} variant="outline" className="w-full">
                  Try Again
                </Button>
              )
            ) : (
              <Button onClick={handleSubmitQuiz} className="w-full" disabled={selectedAnswer === null}>
                Submit Answer
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
