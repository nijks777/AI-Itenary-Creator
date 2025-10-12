'use client'

// Simple test dashboard to see if routing works
export default function TestDashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Test Dashboard
        </h1>
        <p className="text-gray-600">
          If you see this, the dashboard route is working!
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Current URL: {typeof window !== 'undefined' ? window.location.href : 'server'}
        </p>
      </div>
    </div>
  )
}