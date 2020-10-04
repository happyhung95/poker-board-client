import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-scroll'

import { AddPlayerForm, AddTransactionForm, SettleDebts, Transition } from '../../components'
import { displayAddPlayer, displayAddTransaction, displaySettleDebts } from '../../redux/actions'
import { CalculatorSVG, PeopleSVG, TransactionSVG } from '../../svgs'
import { TransferSVG } from '../../svgs/Transfer'
import { AppState } from '../../types'

export const FunctionBar = () => {
  const dispatch = useDispatch()
  const game = useSelector((state: AppState) => state.pokerBoard.game)
  const showAddPlayer = useSelector((state: AppState) => state.pokerBoard.showAddPlayer)
  const showAddTransaction = useSelector((state: AppState) => state.pokerBoard.showAddTransaction)
  const showSettleDebts = useSelector((state: AppState) => state.pokerBoard.showSettleDebts)
  const [showGameBalance, setShowGameBalance] = useState(false)
  const [gameBalance, setGameBalance] = useState(0)

  const { players, gameClosed } = game!

  const checkSum = () => {
    let totalGameBalance = 0
    players.map((player) => (totalGameBalance += player.balance))
    setShowGameBalance(!showGameBalance)
    setGameBalance(totalGameBalance)
  }

  const urls = {
    addPlayer: 'addPlayer',
    addTransaction: 'addTransaction',
    settleDebts: 'settleDebts',
    showBalance: 'showBalance',
  }
  const svgClassName = 'h-10 w-10'
  const functions = [
    {
      url: urls.addPlayer,
      svg: <PeopleSVG className={svgClassName} />,
      handleClick: () => dispatch(displayAddPlayer(!showAddPlayer)),
      skipRender: gameClosed,
    },
    {
      url: urls.addTransaction,
      svg: <TransactionSVG className={svgClassName} />,
      handleClick: () => dispatch(displayAddTransaction(!showAddTransaction)),
      skipRender: gameClosed,
    },
    {
      url: urls.settleDebts,
      svg: <TransferSVG className={svgClassName} />,
      handleClick: () => dispatch(displaySettleDebts(!showSettleDebts)),
      skipRender: !gameClosed,
    },
    {
      url: urls.showBalance,
      svg: <CalculatorSVG className={svgClassName} />,
      handleClick: checkSum,
      skipRender: false,
    },
  ]

  return (
    <>
      <div className="flex my-6 px-10 justify-center">
        {functions.map(({ url, svg, handleClick, skipRender }, index) => (
          <div key={index}>
            {!skipRender && (
              <Link to={url} spy smooth duration={500} delay={100}>
                <div
                  role="button"
                  tabIndex={0}
                  className="p-2 mx-4 border-2 border-gray-700 rounded-lg shadow outline-none"
                  onKeyPress={handleClick}
                  onClick={handleClick}
                >
                  {svg}
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>
      <div id={urls.showBalance}>
        <Transition showCondition={showGameBalance}>
          {gameBalance === 0 ? (
            <div className="my-4 mx-20 p-2 justify-self-center border-2 border-white bg-teal-200 rounded-lg text-teal-600 font-bold font-mono text-xl text-center">
              Balance is 0
            </div>
          ) : (
            <div className="my-4 mx-20 p-2 justify-self-center border-2 border-white bg-red-200 rounded-lg text-red-600 font-bold font-mono text-xl text-center">
              {gameBalance > 0 ? `Surplussing ${gameBalance}` : `Missing ${gameBalance}`}
            </div>
          )}
        </Transition>
      </div>
      <div id={urls.settleDebts}>
        <Transition showCondition={showSettleDebts}>
          <SettleDebts players={players} />
        </Transition>
      </div>
      <div id={urls.addTransaction}>
        <Transition showCondition={showAddTransaction}>
          <AddTransactionForm />
        </Transition>
      </div>
      <div id={urls.addPlayer}>
        <Transition showCondition={showAddPlayer}>
          <AddPlayerForm />
        </Transition>
      </div>
    </>
  )
}
