import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

import { Transition } from './components'
import { CreateGame, FunctionBar, GameCard, GameSelect, NavBar } from './containers'
import { loadAll } from './redux/actions'
import { AppState, GameName } from './types'
import './tailwind.output.css'

export default function App() {
  const dispatch = useDispatch()
  const showGameCard = useSelector((state: AppState) => state.pokerBoard.showGameCard)
  const showCreateGame = useSelector((state: AppState) => state.pokerBoard.showCreateGame)
  const showGameSelect = useSelector((state: AppState) => state.pokerBoard.showGameSelect)

  useEffect(() => {
    async function fetchAllGames() {
      const res = await axios.get('https://poker-board.herokuapp.com/api/v1')
      dispatch(loadAll(res?.data as GameName[]))
    }
    fetchAllGames()
  }, [dispatch])

  return (
    <div className='md:flex md:justify-center'>
      <div className="md:max-w-screen-md md:w-full md:bg-gray-100 min-h-screen">
        <NavBar />
        <Transition showCondition={showCreateGame}>
          <CreateGame />
        </Transition>
        <Transition showCondition={showGameSelect}>
          <GameSelect />
        </Transition>
        <Transition showCondition={showGameCard}>
          <GameCard />
          <FunctionBar />
        </Transition>
      </div>
    </div>
  )
}
