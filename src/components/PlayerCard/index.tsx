import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { Transition } from '../index'
import { DownArrowSVG } from '../../svgs'
import { capitalizeString } from '../../helpers'
import { Player, AppState } from '../../types'

type Props = {
  player: Player
  removeTransaction: (transactionId: string, playerId: string) => void
}

export const PlayerCard = ({ player, removeTransaction }: Props) => {
  const { name, balance, transactions, _id: playerId } = player
  const [showTransactions, displayTransactions] = useState(false)
  const game = useSelector((state: AppState) => state.pokerBoard.game)

  const toggleDropdown = () => displayTransactions((state) => !state)

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
          {transactions.map(({ _id, description, amount, refId, deleted }, index) => (
            <div key={index} className="flex justify-between px-6">
              <div className="flex">
                <div className="text-gray-600 text-sm"> - {description}</div>
                {refId && !deleted && !game?.gameClosed && (
                  <button
                    className="ml-2 font-semibold text-gray-500 text-sm"
                    onClick={() => {
                      toggleDropdown()
                      removeTransaction(_id, playerId)
                    }}
                  >
                    x
                  </button>
                )}
              </div>
              <div className="text-gray-600 text-sm">{amount}</div>
            </div>
          ))}
        </div>
      </Transition>
    </div>
  )
}
