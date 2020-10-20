import React from 'react'

import { settleDebts } from '../../helpers'
import { Player } from '../../types'

type Props = {
  players: Player[]
}

export const SettleDebts = ({ players }: Props) => {
  const { warningMsg, transfers } = settleDebts(players)

  return (
    <div className="px-4 my-4">
      <div className="pl-8 pr-2 py-4 text-gray-700 font-mono font-semibold bg-gray-300 rounded-md">
        {!warningMsg && transfers.length === 0 && 'No transfers can be made'}
        {warningMsg && <div className="text-red-600">{warningMsg}</div>}
        {transfers.map((transfer, index) => (
          <div key={index}>{transfer}</div>
        ))}
      </div>
    </div>
  )
}
