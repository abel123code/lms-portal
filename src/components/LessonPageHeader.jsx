import React from 'react'
import { Book, Search } from 'lucide-react'
import { Input } from "@/components/ui/input"


const LessonPageHeader = ({
    header,
    subheader,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-2 rounded-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold leading-tight">
                {header}
            </h1>
            <p className="mt-2 text-lg text-blue-200">
                {subheader}
            </p>
            </div>
        </div>
        </div>
    </div>
  )
}

export default LessonPageHeader