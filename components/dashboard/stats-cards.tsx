'use client'

import { Coins, MapPin, History, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function StatsCards() {
  // Mock data since we removed authentication
  const credits = 1000
  const totalCreditsUsed = 0
  const planType = 'FREE'

  const stats = [
    {
      title: "Available Credits",
      value: credits.toLocaleString(),
      description: `Plan ${Math.floor(credits / 10)} basic trips`,
      icon: Coins,
      color: "text-yellow-600"
    },
    {
      title: "Total Trips",
      value: "0",
      description: "Start planning your first trip",
      icon: MapPin,
      color: "text-blue-600"
    },
    {
      title: "Credits Used",
      value: totalCreditsUsed.toLocaleString(),
      description: "Since you joined",
      icon: History,
      color: "text-red-600"
    },
    {
      title: "Plan Type",
      value: planType,
      description: getPlanDescription(planType),
      icon: TrendingUp,
      color: getPlanColor(planType)
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function getPlanDescription(planType: string): string {
  switch (planType) {
    case 'PREMIUM':
      return 'Unlimited features'
    case 'BASIC':
      return '500 monthly credits'
    case 'FREE':
    default:
      return '100 monthly credits'
  }
}

function getPlanColor(planType: string): string {
  switch (planType) {
    case 'PREMIUM':
      return 'text-purple-600'
    case 'BASIC':
      return 'text-blue-600'
    case 'FREE':
    default:
      return 'text-gray-600'
  }
}
