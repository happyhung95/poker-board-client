import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Loader from 'react-loader-spinner'
import axios from 'axios'

import { PlayerCard } from '../../components'
import { loadGame } from '../../redux/actions'
import { Game, AppState } from '../../types'

export const GameCard = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const game = useSelector((state: AppState) => state.pokerBoard.game)

  const changeStatus = async (isClosed: boolean) => {
    setLoading(true)
    const res = await axios.put(`https://poker-board.herokuapp.com/api/v1/game/${game?._id}`, {
      gameClosed: isClosed,
    })
    dispatch(loadGame(res.data as Game))
    setLoading(false)
  }

  return (
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
        <PlayerCard key={index} player={player} players={game.players} />
      ))}
    </div>
  )
}
