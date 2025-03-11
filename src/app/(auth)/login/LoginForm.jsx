"use client"; // Ensures this is a Client Component

import React from "react";
import { signIn } from "next-auth/react"; // Un-comment this when enabling OAuth
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideLogIn } from "lucide-react";

export default function LoginForm() {
  async function handleGoogleLogin() {
    //console.log("Google login triggered!!");
    // Uncomment this when enabling Google OAuth
    await signIn("google",{ callbackUrl: "/student" });
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <Card className="w-11/12 max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl shadow-lg">
        <CardHeader className="text-center space-y-2">
          {/* Login Icon */}
          <div className="mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-3 w-16 h-16 flex items-center justify-center">
            <LucideLogIn className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-base">
            Sign in to your account using Google
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Google Sign-in Button */}
          <Button
            variant="outline"
            className="w-full py-4 text-base font-medium border-2 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all duration-200 ease-in-out"
            onClick={handleGoogleLogin}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="currentColor"
            >
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            Sign in with Google
          </Button>

          {/* Terms of Service */}
          <p className="text-center text-sm text-gray-600 leading-relaxed">
            By signing in, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
