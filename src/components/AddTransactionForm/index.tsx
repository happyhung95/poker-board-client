/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, FormikHelpers, Form, Field } from 'formik'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Loader from 'react-loader-spinner'

import api from '../../api'
import { Transition, Popup } from '../index'
import { loadGame } from '../../redux/actions'
import { capitalizeString } from '../../helpers/index'
import { Game, AppState, TransactionRequest } from '../../types'

type FormValues = {
  lenderId: string
  borrowerId: string
  amount: string
}

export const AddTransactionForm = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [showWarning, displayWarning] = useState(false)
  const game = useSelector((state: AppState) => state.pokerBoard.game)

  const { players } = game!

  const handleSubmit = async (
    { borrowerId, lenderId, amount }: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    if (!borrowerId || !lenderId) return
    if (borrowerId === lenderId) {
      displayWarning(true)
      return
    }
    setLoading(true)

    const req: TransactionRequest = {
      gameId: game!._id,
      requests: [],
    }
    const amountInt = parseInt(amount as string)

    if (borrowerId === 'buyOut') {
      req.requests.push({
        type: 'add',
        transactionId: null,
        ownerId: lenderId,
        counterPartyId: null,
        description: 'Buy-out',
        amount: amountInt,
        refId: null,
      })
    } else {
      const lenderName = players.find((player) => player._id === lenderId)?.name
      const borrowerName = players.find((player) => player._id === borrowerId)?.name
      const refId = `${lenderName}-${borrowerName}-${Date.now()}`
      req.requests.push(
        {
          type: 'add',
          transactionId: null,
          ownerId: lenderId,
          counterPartyId: borrowerId!,
          description: `${capitalizeString(lenderName!)} lent to ${capitalizeString(borrowerName!)}`,
          amount: amountInt,
          refId,
        },
        {
          type: 'add',
          transactionId: null,
          ownerId: borrowerId,
          counterPartyId: lenderId!,
          description: `${capitalizeString(borrowerName!)} borrowed from ${capitalizeString(lenderName!)}`,
          amount: -amountInt,
          refId,
        }
      )
    }

    const res = await api.post<Game>('/transactions', { ...req })
    dispatch(loadGame(res.data))
    resetForm({})
    setLoading(false)
  }

  return (
    <>
      <div className="my-6 mx-4 bg-gray-300 rounded shadow">
        <div className="pt-4 pl-8 font-bold text-xl text-gray-700 shadow">Add transactions</div>
        <Formik
          initialValues={{ borrowerId: '', lenderId: '', amount: game!.buyIn.toString() }}
          onSubmit={handleSubmit}
        >
          <Form className="px-4 border-2">
            <div className="flex my-3 px-3 items-end justify-between">
              <div className="w-1/3 pr-2">
                <div className="pb-1 px-1 font-mono font-medium text-xs text-gray-600">From</div>
                <Field
                  className="mx-1 p-1 w-full font-mono bg-gray-200 text-gray-800 text-sm"
                  as="select"
                  name="lenderId"
                >
                  <option value="" />
                  {players.map((player) => (
                    <option value={player._id}>{capitalizeString(player.name)}</option>
                  ))}
                </Field>
              </div>
              <div className="w-1/3 pr-2">
                <div className="pb-1 px-1 font-mono font-medium text-xs text-gray-600">To</div>
                <Field
                  className="mx-1 p-1 w-full font-mono bg-gray-200 text-gray-800 text-sm"
                  as="select"
                  name="borrowerId"
                >
                  <option value="" />
                  {players.map((player) => (
                    <option value={player._id}>{capitalizeString(player.name)}</option>
                  ))}
                  <option value="buyOut">Buy out</option>
                </Field>
              </div>
              <div className="w-1/3 pl-1">
                <div className="pb-1 px-1 font-mono font-medium text-xs text-gray-600">Amount</div>
                <Field
                  className="py-1/2 px-2 w-full font-mono font-medium text-gray-800 border border-gray-200 border-opacity-25 rounded bg-gray-200 outline-none"
                  placeholder={game!.buyIn}
                  name="amount"
                />
              </div>
            </div>
            <div className="m-4">
              <button
                className="w-20 p-2 border-2 flex justify-center border-white rounded-lg bg-gray-800 text-white font-mono font-semibold outline-none"
                type="submit"
                disabled={loading}
              >
                {!loading ? 'Submit' : <Loader type="Bars" color="#fff" height={25} width={25} />}
              </button>
            </div>
          </Form>
        </Formik>
      </div>
      <Transition showCondition={showWarning}>
        <Popup
          type="info"
          title="Oops.."
          message="The person cannot lend to him/herself"
          confirmBtnLabel="Got it!"
          confirmHandler={() => {
            displayWarning(false)
          }}
        />
      </Transition>
    </>
  )
}
