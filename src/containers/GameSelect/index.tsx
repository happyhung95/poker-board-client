import React, { useState } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import axios from 'axios'

import { Alert, Transition } from '../../components'
import { DownArrowSVG } from '../../svgs'
import { loadAll, loadGame, displayGameList, displayGameCard } from '../../redux/actions'
import { Game, GameName, AppState } from '../../types'

type GameFetching = {
  _id: string
  status: boolean
}

export const GameSelect = () => {
  const dispatch = useDispatch()
  const allGames = useSelector((state: AppState) => state.pokerBoard.allGames)
  const game = useSelector((state: AppState) => state.pokerBoard.game)
  const showGameList = useSelector((state: AppState) => state.pokerBoard.showGameList)

  const [fetchingGame, setFetchingGame] = useState<GameFetching | undefined>()
  const [deleteGame, setDeleteGame] = useState<GameName | undefined>()

  const toggleDropdown = () => {
    if (showGameList) {
      dispatch(displayGameList(false))
      if (game) setTimeout(() => dispatch(displayGameCard(true)), 150)
    } else {
      if (game) dispatch(displayGameCard(false))
      setTimeout(() => dispatch(displayGameList(true)), 150)
    }
  }

  const handleGameSelect = async ({ _id }: GameName) => {
    setFetchingGame({ _id, status: true })
    const res = await axios.get(`https://poker-board.herokuapp.com/api/v1/${_id}`)
    batch(() => {
      dispatch(loadGame(res.data as Game))
      dispatch(displayGameList(false))
    })
    setTimeout(() => dispatch(displayGameCard(true)), 150)
    setFetchingGame(undefined)
  }

  const sendDeleteRequest = async () => {
    await axios.delete(`https://poker-board.herokuapp.com/api/v1/game/${deleteGame?._id}`)
    const res = await axios.get('https://poker-board.herokuapp.com/api/v1')
    setDeleteGame(undefined)
    dispatch(loadAll(res.data as GameName[]))
  }

  return (
    <div className="mt-2 px-4">
      {/* select game panel */}
      <div
        tabIndex={0}
        className="px-4 py-2 flex items-center bg-gray-300 border-gray-400 rounded shadow outline-none"
        role="button"
        onKeyPress={toggleDropdown}
        onClick={toggleDropdown}
      >
        <DownArrowSVG
          className={`h-5 w-5 transform transition duration-100 ease-in-out ${!showGameList && '-rotate-90'} `}
        />
        <p className="font-bold text-xl">{game ? game.name : 'Select game'}</p>
      </div>
      {/* Game panel */}
      <Transition showCondition={showGameList}>
        <div className="flex-col mt-2 px-8 bg-gray-300 rounded-lg shadow-lg transition ease-in-out duration-100 ">
          {allGames ? (
            <>
              {allGames.map(({ _id, name }, index) => (
                <div
                  className={`my-1 pl-1 pr-2 py-1 flex justify-between items-center ${
                    index !== 0 && 'border-t border-opacity-25 border-gray-600'
                  }`}
                >
                  <button
                    className="w-11/12 flex items-center outline-none"
                    key={_id}
                    onKeyPress={() => handleGameSelect({ _id, name })}
                    onClick={() => handleGameSelect({ _id, name })}
                    disabled={Boolean(fetchingGame?.status)}
                  >
                    <span className={game?._id === _id ? 'font-bold text-xl' : 'text-gray-600 text-xl'}>{name}</span>
                    {fetchingGame?._id === _id && (
                      <span className="pl-5">
                        <Loader type="Bars" color="#cbd5e0" height={25} width={25} />
                      </span>
                    )}
                  </button>
                  <button
                    className="w-1/12 mr-1 justify-self-end outline-none"
                    onClick={() => setDeleteGame({ _id, name })}
                  >
                    <span
                      className={`px-2 py-1 border-2 border-gray-400 rounded-lg ${
                        game?._id === _id ? ' border-gray-600 font-bold text-sm' : 'text-gray-400 text-sm'
                      }`}
                    >
                      x
                    </span>
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className="py-10 flex justify-center">
              <Loader type="Bars" color="#cbd5e0" height={40} width={40} />
            </div>
          )}
        </div>
      </Transition>
      {/* Delete game alert */}
      <Transition showCondition={Boolean(deleteGame)}>
        <Alert
          title={`Delete: ${deleteGame?.name}`}
          message="Are you sure you want to delete this game? All of the data will be permanently removed."
          confirmBtnLabel="Delete"
          confirmHandler={sendDeleteRequest}
          cancelHandler={() => setDeleteGame(undefined)}
        />
      </Transition>
    </div>
  )
}
