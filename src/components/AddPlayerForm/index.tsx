/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, FormikHelpers, Form, Field, FieldArray } from 'formik'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Loader from 'react-loader-spinner'

import api from '../../api'
import { loadGame } from '../../redux/actions'
import { capitalizeString } from '../../helpers/index'
import { Game, AppState } from '../../types'

type FormValues = {
  names: string[]
}

type AddPlayerRequest = {
  type: 'add' | 'remove'
  playerId: null
  name: string
}

type Request = {
  gameId: string
  requests: AddPlayerRequest[]
}

export const AddPlayerForm = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const game = useSelector((state: AppState) => state.pokerBoard.game)

  const handleSubmit = async ({ names }: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    if (names.every((name) => name === '')) return
    setLoading(true)

    const req: Request = {
      gameId: game!._id,
      requests: [],
    }
    names
      .filter((name) => !!name)
      .map((name) => {
        req.requests.push({
          type: 'add',
          playerId: null,
          name: capitalizeString(name),
        })
      })

    const res = await api.post<Game>('/players', { ...req })
    dispatch(loadGame(res.data))
    resetForm({})
    setLoading(false)
  }

  return (
    <div className="my-6 mx-4 bg-gray-300 rounded shadow">
      <div className="pt-4 pl-5 font-bold text-xl text-gray-700 shadow">Add players</div>
      <Formik
        initialValues={{ names: ['', '', ''] }}
        onSubmit={handleSubmit}
        render={({ values }) => (
          <Form className=" px-4 border-2">
            <FieldArray
              name="names"
              render={(arrayHelpers) => (
                <div>
                  {values.names && values.names.length > 0 ? (
                    values.names.map((name, index) => (
                      <div key={index} className="my-2 flex justify-around items-center">
                        <p className="text-gray-600 font-bold">Name:</p>
                        <Field
                          className=" w-1/2 py-1/2 px-2 font-mono font-medium text-white border border-gray-600 border-opacity-25 rounded bg-gray-500 outline-none"
                          name={`names.${index}`}
                        />
                        <button
                          className="mx-1 px-2 font-bold text-xl text-white border-2 border-gray-600 rounded-lg bg-gray-500"
                          type="button"
                          onClick={() => arrayHelpers.insert(index + 1, '')} // insert an empty string at a position
                        >
                          +
                        </button>
                        <button
                          className="px-2 font-bold text-xl text-white border-2 border-gray-600 rounded-lg bg-gray-500"
                          type="button"
                          onClick={() => arrayHelpers.remove(index)} // remove a name from the list
                        >
                          -
                        </button>
                      </div>
                    ))
                  ) : (
                    <button
                      className="my-2 px-3 py-1/2 border-2 border-gray-600 bg-gray-600 rounded-md text-white font-semibold shadow"
                      type="button"
                      onClick={() => arrayHelpers.push('')}
                    >
                      {/* show this when user has removed all friends from the list */}
                      Add a name
                    </button>
                  )}
                  {values.names.length > 0 && (
                    <div className="mt-2 mb-6">
                      <button
                        className="w-20 p-2 border-2 flex justify-center border-white rounded-lg bg-gray-800 text-white font-mono font-semibold outline-none"
                        type="submit"
                        disabled={loading}
                      >
                        {!loading ? 'Submit' : <Loader type="Bars" color="#fff" height={25} width={25} />}
                      </button>
                    </div>
                  )}
                </div>
              )}
            />
          </Form>
        )}
      />
    </div>
  )
}
