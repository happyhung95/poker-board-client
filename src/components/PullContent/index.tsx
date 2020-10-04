import React from 'react'
import { DownArrowSVG } from '../../svgs'

export const PullContent = () => (
  <>
    <div className="pt-2 text-gray-600 text-center text-sm font-medium font-mono"> pull to refresh </div>
    <div className="flex justify-center">
      <DownArrowSVG className="h-5 w-5 text-gray-600" />
    </div>
  </>
)
