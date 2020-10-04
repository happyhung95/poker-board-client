import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

import { Transition, Popup } from './components'
import { CreateGame, FunctionBar, GameCard, GameSelect, NavBar } from './containers'
import { loadAll } from './redux/actions'
import { AppState, GameName } from './types'
import './tailwind.output.css'

export default function App() {
  const dispatch = useDispatch()
  const [showPopup, displayPopup] = useState(true)
  const showGameCard = useSelector((state: AppState) => state.pokerBoard.showGameCard)
  const showCreateGame = useSelector((state: AppState) => state.pokerBoard.showCreateGame)
  const showGameSelect = useSelector((state: AppState) => state.pokerBoard.showGameSelect)

  useEffect(() => {
    async function fetchAllGames() {
      const res = await axios.get('https://poker-board.herokuapp.com/api/v1')
      dispatch(loadAll(res?.data.reverse() as GameName[]))
    }
    fetchAllGames()
  }, [dispatch])

  return (
    <div className="md:flex md:justify-center">
      <div className="md:max-w-screen-md md:w-full md:bg-gray-100 min-h-screen">
        <Transition showCondition={showPopup}>
          <Popup
            title="Disclaimer"
            message="Poker Board is a free tool available to the world. By continuing you agree to publicly share any data posted to Poker Board. It means everyone will know how bad you are at poker :)"
            confirmBtnLabel="I agree to share my data"
            confirmHandler={() => {
              displayPopup(false)
            }}
          />
        </Transition>
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
