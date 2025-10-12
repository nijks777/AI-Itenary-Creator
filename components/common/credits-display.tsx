'use client'

import { Coins, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface CreditsDisplayProps {
  showDetails?: boolean
  className?: string
}

export function CreditsDisplay({ showDetails = false, className }: CreditsDisplayProps) {
  // Mock data since we removed authentication
  const credits = 1000
  const totalCreditsUsed = 0
  const planType = 'FREE'

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'PREMIUM':
        return 'text-purple-600 bg-purple-100'
      case 'BASIC':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Credits with dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2">
            <Coins className="h-5 w-5 text-yellow-500" />
            <span className="font-medium text-lg">
              {credits.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">credits</span>
            <Info className="h-4 w-4 text-gray-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Credit Details</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <div className="flex justify-between w-full">
              <span>Available Credits:</span>
              <span className="font-medium">{credits.toLocaleString()}</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex justify-between w-full">
              <span>Credits Used:</span>
              <span className="font-medium">{totalCreditsUsed.toLocaleString()}</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex justify-between w-full">
              <span>Plan Type:</span>
              <span className="font-medium">{planType}</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <div className="text-xs text-gray-500">
              Plan {Math.floor(credits / 10)} basic trips with current credits
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Plan Badge */}
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(planType)}`}>
        {planType}
      </div>
    </div>
  )
}
