"use server";

import Teacher from "@/lib/modal/Teacher";
import Student from "@/lib/modal/Student";
import connectToDB from "@/lib/mongodb";
import User from "@/lib/modal/User";

export async function fetchStudentsByTeacher(userId) {
    try {
        await connectToDB();
  
        // Find teacher by userId instead of _id
        const teacher = await Teacher.findOne({ userId }).select("classes");
        if (!teacher) {
            throw new Error("Teacher not found");
        }
        //console.log('teacher:::', teacher)
  
        // 2) Query students enrolled in any of the teacher's classes
        //    Use .lean() to get plain JavaScript objects (no Mongoose overhead).
        const students = await Student.find({
            enrolledClasses: { $in: teacher.classes },
        })
            .select("userId")
            .populate("userId", "name email image")
            .lean();
  
        // 3) Transform the response to remove or convert _id fields
        //    so there's no risk of circular references or big objects.
        const safeData = students.map((item) => {
            // item._id is the Student's _id
            // item.userId is the populated user document
            const { userId } = item;
            return {
            // Remove or rename anything you don't need
            // Keep only what's necessary for your form
            userId: userId?._id?.toString() || "",  // Convert to string
            name: userId?.name || "",
            email: userId?.email || "",
            image: userId?.image || "",
            };
        });

        //console.log('fectch student by teacher data:::', safeData)
    
        return safeData;
    } catch (error) {
      console.error("Error fetching students:", error);
      return { error: "Failed to fetch students" };
    }
}