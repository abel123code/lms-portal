"use client"
import React from "react";
import { Clock, AlertCircle } from "lucide-react"; // Professional icons
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WaitingForApproval = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-white shadow-lg rounded-lg p-6 text-center">
        {/* Header */}
        <CardHeader className="flex flex-col items-center space-y-3">
          <div className="bg-black p-4 rounded-full">
            <Clock className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Waiting for Approval
          </CardTitle>
        </CardHeader>

        {/* Body */}
        <CardContent className="text-gray-600 space-y-4">
          <p className="text-lg">
            Your account is currently under review. Please wait while an admin approves your access.
          </p>
          <div className="flex items-center justify-center text-sm text-gray-500 space-x-2">
            <AlertCircle className="w-5 h-5 text-gray-400" />
            <span>This process may take some time. Our admin is vetting your profile.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitingForApproval;
