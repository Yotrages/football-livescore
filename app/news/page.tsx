"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'

const Page = () => {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8">
              <div className="flex items-center mb-8">
                <button
                  onClick={() => router.back()}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <FaArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
              </div>
              
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-10 h-10 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                  No news
                </h1>
                <p className="text-gray-600 mb-6 text-center max-w-md">
                  We couldn&apos;t load news, still looking for writer
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Try Again later
                </button>
              </div>
            </div>
          </div>
  )
}

export default Page