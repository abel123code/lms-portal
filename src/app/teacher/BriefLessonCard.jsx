import React from "react";
import Link from "next/link";
import { Calendar, CheckCircle, Circle, BookCheck, User } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const BriefLessonCard = ({ lessonId, title, studentName, createdAt, completed }) => {
  return (
    <Link href={`/teacher/${lessonId}`} className="block">
      <Card className="w-full max-w-md overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <BookCheck className="h-4 w-4 text-gray-900" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {studentName && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>Student: {studentName}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Created: {createdAt}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {completed ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Circle className="h-4 w-4 text-gray-400" />
              )}
              <span className={completed ? "text-green-600" : "text-gray-600"}>
                {completed ? "Completed" : "Not completed"}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-gray-50 px-6 py-3">
          <Badge
            variant={completed ? "default" : "outline"}
            className={completed ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
          >
            {completed ? "Completed" : "Pending"}
          </Badge>
          <Button variant="outline" size="sm" className="text-sm">
            View Lesson
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BriefLessonCard;
