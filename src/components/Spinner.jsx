import React from 'react'

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2 text-gray-500">
        <div className="h-10 w-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium">Loading lesson...</span>
        </div>
    </div>
  )
}

export default Spinner
  