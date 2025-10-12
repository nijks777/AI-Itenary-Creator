'use client'

import { useState } from 'react'
import { MapPin, History, Settings, CreditCard, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PlanTripForm } from './plan-trip-form'

export function QuickActions() {
  const [showPlanTripForm, setShowPlanTripForm] = useState(false)

  const actions = [
    {
      title: "Plan New Trip",
      description: "Create AI-powered travel itineraries",
      icon: Plus,
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: () => setShowPlanTripForm(true),
      disabled: false
    },
    {
      title: "Trip History",
      description: "View and manage your previous trips",
      icon: History,
      color: "bg-green-500 hover:bg-green-600",
      onClick: () => console.log('View trip history'),
      disabled: false
    },
    {
      title: "Explore Destinations",
      description: "Discover popular travel destinations",
      icon: Search,
      color: "bg-purple-500 hover:bg-purple-600",
      onClick: () => console.log('Explore destinations'),
      disabled: false
    },
    {
      title: "Buy Credits",
      description: "Purchase more credits for planning",
      icon: CreditCard,
      color: "bg-orange-500 hover:bg-orange-600",
      onClick: () => console.log('Buy credits'),
      disabled: false
    }
  ]

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {actions.map((action, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span>{action.title}</span>
              </CardTitle>
              <CardDescription>
                {action.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className={`w-full ${action.color} text-white border-0`}
                onClick={action.onClick}
                disabled={action.disabled}
              >
                <action.icon className="h-4 w-4 mr-2" />
                {action.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <PlanTripForm
        open={showPlanTripForm}
        onOpenChange={setShowPlanTripForm}
      />
    </>
  )
}
