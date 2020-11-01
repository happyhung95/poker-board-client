import React, { useState } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Loader from 'react-loader-spinner'

import api from '../../api'
import { PlayerCard, Transition, Popup } from '../../components'
import { displayAddPlayer, displayAddTransaction, displaySettleDebts, loadGame } from '../../redux/actions'
import { Game, AppState, TransactionRequest, Transaction, DefaultTransaction as DT } from '../../types'

export const GameCard = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const game = useSelector((state: AppState) => state.pokerBoard.game)
  const showAddPlayer = useSelector((state: AppState) => state.pokerBoard.showAddPlayer)
  const showAddTransaction = useSelector((state: AppState) => state.pokerBoard.showAddTransaction)
  const showSettleDebts = useSelector((state: AppState) => state.pokerBoard.showSettleDebts)
  const [deleteTransaction, setDeleteTransaction] = useState<Transaction | undefined>()
  const [showError, displayError] = useState(false)

  const changeStatus = async (isClosed: boolean) => {
    setLoading(true)
    const res = await api.put<Game>(`/game/${game?._id}`, {
      gameClosed: isClosed,
    })
    batch(() => {
      dispatch(loadGame(res.data))
      if (isClosed && showAddPlayer) dispatch(displayAddPlayer(false))
      if (isClosed && showAddTransaction) dispatch(displayAddTransaction(false))
      if (!isClosed && showSettleDebts) dispatch(displaySettleDebts(false))
    })
    setLoading(false)
  }

  const handleRemoveTransaction = (transactionId: string, playerId: string) => {
    const transaction = game?.players
      .find((player) => player._id === playerId)
      ?.transactions.find((transaction) => transaction._id === transactionId)
    setDeleteTransaction(transaction)
  }

  const sendRemoveTransactionRequest = async () => {
    const req: TransactionRequest = {
      gameId: game!._id,
      requests: [],
    }

    if (deleteTransaction?.refId === DT.buyOut || deleteTransaction?.refId === DT.buyIn) {
      req.requests.push({
        type: 'remove',
        transactionId: deleteTransaction!._id,
        ownerId: deleteTransaction!.ownerId,
        counterPartyId: deleteTransaction!.counterPartyId,
        description: deleteTransaction!.description,
        amount: deleteTransaction!.amount,
        refId: deleteTransaction!.refId,
      })
    } else {
      const pairedTransaction = game?.players
        .find((player) => player._id === deleteTransaction?.counterPartyId)
        ?.transactions.find((transaction) => transaction.refId === deleteTransaction?.refId)

      if (!pairedTransaction) {
        displayError(true)
        return
      }

      req.requests.push(
        {
          type: 'remove',
          transactionId: deleteTransaction!._id,
          ownerId: deleteTransaction!.ownerId,
          counterPartyId: deleteTransaction!.counterPartyId,
          description: deleteTransaction!.description,
          amount: deleteTransaction!.amount,
          refId: deleteTransaction!.refId,
        },
        {
          type: 'remove',
          transactionId: pairedTransaction!._id,
          ownerId: pairedTransaction!.ownerId,
          counterPartyId: pairedTransaction!.counterPartyId,
          description: pairedTransaction!.description,
          amount: pairedTransaction!.amount,
          refId: pairedTransaction!.refId,
        }
      )
    }

    const res = await api.post<Game>('/transactions', { ...req })
    setDeleteTransaction(undefined)
    dispatch(loadGame(res.data))
  }

  return (
    <>
      <div className="mt-2 mx-4 border-2 rounded shadow-sm bg-gray-300 outline-none">
        {game?.gameClosed ? (
          <div className="pl-2 flex justify-between items-center">
            <div className="flex items-center">
              <div className="px-2 ml-3 mr-2 text-white bg-red-500 rounded-full text-sm font-semibold">Finished</div>
              <button
                onClick={() => changeStatus(false)}
                className="w-24 px-1 flex justify-center border-2 border-teal-600 rounded bg-gray-100 text-sm text-teal-600 font-bold outline-none"
                disabled={loading}
              >
                {!loading ? 'Reactivate?' : <Loader type="Bars" color="#319795" height={18} width={18} />}
              </button>
            </div>
            <div className="text-right pt-2 pb-1 pr-6 font-semibold text-gray-600">Buy-in: {game.buyIn}</div>
          </div>
        ) : (
          <div className="pl-2 flex justify-between items-center">
            <div className="flex items-center">
              <div className="px-2 ml-3 mr-2 text-white bg-teal-500 rounded-full text-sm font-semibold">Ongoing</div>
              <button
                onClick={() => changeStatus(true)}
                className="w-20 px-1 flex justify-center border-2 border-red-500 rounded bg-gray-100 text-sm text-red-500 font-bold outline-none"
                disabled={loading}
              >
                {!loading ? 'Finish?' : <Loader type="Bars" color="#f56565" height={18} width={18} />}
              </button>
            </div>
            <div className="text-right pt-2 pb-1 pr-6 font-semibold text-gray-600">Buy-in: {game?.buyIn}</div>
          </div>
        )}
        {game?.players.map((player, index) => (
          <PlayerCard key={index} player={player} removeTransaction={handleRemoveTransaction} />
        ))}
      </div>
      {/* Delete transaction alert */}
      <Transition showCondition={Boolean(deleteTransaction)}>
        <Popup
          type="alert"
          title="Remove transaction"
          message={`Are you sure you want to remove this transaction: ${deleteTransaction?.description}, amount: ${deleteTransaction?.amount}?`}
          confirmBtnLabel="Remove"
          confirmHandler={sendRemoveTransactionRequest}
          cancelHandler={() => setDeleteTransaction(undefined)}
        />
      </Transition>
      {/* Error in case the refId was created incorrectly by other platforms */}
      <Transition showCondition={showError}>
        <Popup
          type="info"
          title="Oops.."
          message={`Something went wrong. The paired transaction of "${deleteTransaction?.description}", amount: ${deleteTransaction?.amount} cannot be found`}
          confirmBtnLabel="Go back"
          confirmHandler={() => {
            setDeleteTransaction(undefined)
            displayError(false)
          }}
        />
      </Transition>
    </>
  )
}
