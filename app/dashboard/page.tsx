'use client'

import { ProtectedPage } from '@/components/common'
import { DashboardHeader, StatsCards, QuickActions, RecentActivity } from '@/components/dashboard'

export default function DashboardPage() {
  return (
    <ProtectedPage className="bg-gray-50">
      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-600">
            Plan your next adventure with AI-powered trip recommendations.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards />
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions - Takes 2/3 of the space */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <QuickActions />
          </div>

          {/* Recent Activity - Takes 1/3 of the space */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>
      </main>
    </ProtectedPage>
  )
}
