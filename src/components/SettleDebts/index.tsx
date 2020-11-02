import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Formik, Form, Field } from 'formik'

import { Transition } from '../index'
import { settleDebts } from '../../helpers'
import { SettleDebtResult, AppState, Player } from '../../types'

type FormValues = {
  rate: string
}

export const SettleDebts = () => {
  const game = useSelector((state: AppState) => state.pokerBoard.game)
  const [result, setResult] = useState<undefined | SettleDebtResult>()
  const [error, setError] = useState('')
  const [exchangedResult, setExchangedResult] = useState<undefined | SettleDebtResult>()

  useEffect(() => setResult(settleDebts(game!.players)), [game])

  const handleSubmit = ({ rate }: FormValues) => {
    if (isNaN(Number(rate))) {
      setError('Please input only numbers')
      return
    }
    const rateInt = rate ? Math.abs(parseInt(rate)) : 10
    if (rateInt === 0) {
      setError('Please input numbers higher than 0')
      return
    }
    if (error) {
      setError('')
    }
    setExchangedResult(undefined) // for effect
    const exchangedPlayers: Player[] = JSON.parse(JSON.stringify(game!.players))
    exchangedPlayers.forEach((player) => (player.balance /= rateInt))
    setExchangedResult(settleDebts(exchangedPlayers, '€'))
  }

  return (
    <div className="px-4 my-4">
      <div className="pl-8 pr-2 py-4 text-gray-700 font-mono font-semibold bg-gray-300 rounded-md">
        {!result?.warningMsg && result?.transfers.length === 0 && 'No transfers can be made'}
        {result?.warningMsg && <div className="text-red-600">{result?.warningMsg}</div>}
        {result?.transfers.map((transfer, index) => (
          <div key={index}>{transfer}</div>
        ))}
        <div>
          <div className="my-4 py-2 px-6 w-auto inline-block rounded-lg border-2 border-gray-800 shadow-md">
            <div className="pt-2">EXCHANGE CHIPS:</div>
            <Formik initialValues={{ rate: '' }} onSubmit={handleSubmit}>
              <Form>
                <div className="my-1 flex items-center">
                  <div>1 chip = </div>
                  <Field
                    className="mx-2 px-2 w-12 text-base font-mono font-medium text-gray-600 border border-gray-200 border-opacity-25 rounded bg-gray-200 outline-none"
                    placeholder={10}
                    name="rate"
                  />
                  <div>cents</div>
                </div>
                <Transition showCondition={Boolean(error)}>
                  <div className="text-xs font-thin text-red-600">{error}</div>
                </Transition>
                <button
                  className="w-24 my-1 py-1 border-2 rounded-lg bg-gray-800 text-white font-mono font-semibold outline-none"
                  type="submit"
                >
                  Exchange
                </button>
              </Form>
            </Formik>
          </div>
        </div>
        <Transition showCondition={Boolean(exchangedResult) && !error}>
          {exchangedResult?.warningMsg && <div className="text-red-600">{exchangedResult?.warningMsg}</div>}
          {exchangedResult?.transfers.map((transfer, index) => (
            <div key={index}>{transfer}</div>
          ))}
        </Transition>
      </div>
    </div>
  )
}
