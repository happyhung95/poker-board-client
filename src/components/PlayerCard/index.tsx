import React, { useState } from 'react'

import { Transition } from '../Transition'
import { DownArrowSVG } from '../../svgs'
import { capitalizeString } from '../../helpers'
import { Player } from '../../types'

type Props = {
  player: Player
  players: Player[]
}

export const PlayerCard = ({ player, players }: Props) => {
  const { name, balance, transactions } = player
  const [showTransactions, toggleShowTransactions] = useState(false)

  const toggleDropdown = () => toggleShowTransactions(!showTransactions)

  return (
    <div
      className={`mb-2 mx-2 border-2 border-gray-300 rounded-md transition
       ease-in-out duration-200 ${showTransactions && 'border-gray-600 shadow '} `}
    >
      {/* Player menu */}
      <div
        tabIndex={0}
        className="pl-1 pr-4 mt-2 flex justify-between items-center outline-none"
        role="button"
        onKeyPress={toggleDropdown}
        onClick={toggleDropdown}
      >
        <div className="flex items-center">
          <DownArrowSVG
            className={`h-5 w-5 transform transition duration-200 ease-in-out ${!showTransactions && '-rotate-90'}`}
          />
          <div className={`text-lg font-semibold transform ${showTransactions && 'translate-x-2'}`}>
            {capitalizeString(name)}
          </div>
        </div>
        <div className={`text-lg font-semibold transform ${showTransactions && '-translate-x-2'}`}>{balance}</div>
      </div>
      {/* Transactions */}
      <Transition showCondition={showTransactions}>
        <div
          tabIndex={0}
          className="py-2 outline-none"
          role="button"
          onKeyPress={toggleDropdown}
          onClick={toggleDropdown}
        >
          {transactions.map(({ description, amount }, index) => (
            <div key={index} className="flex justify-between px-6">
              <div className="text-gray-600 text-sm"> - {description}</div>
              <div className="text-gray-600 text-sm">{amount}</div>
            </div>
          ))}
        </div>
      </Transition>
    </div>
  )
}
