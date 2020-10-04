import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PullToRefresh from 'react-simple-pull-to-refresh'
import axios from 'axios'

import { Transition, Popup, PullContent, OnPullRequest } from './components'
import { CreateGame, FunctionBar, GameCard, GameSelect, NavBar } from './containers'
import { loadAll, loadGame } from './redux/actions'
import { AppState, GameName, Game } from './types'
import './tailwind.output.css'

export default function App() {
  const dispatch = useDispatch()
  const [showPopup, displayPopup] = useState(true)
  const game = useSelector((state: AppState) => state.pokerBoard.game)
  const showGameCard = useSelector((state: AppState) => state.pokerBoard.showGameCard)
  const showCreateGame = useSelector((state: AppState) => state.pokerBoard.showCreateGame)
  const showGameSelect = useSelector((state: AppState) => state.pokerBoard.showGameSelect)

  const handleRefresh = async () => {
    if (game) {
      const res = await axios.get(`https://poker-board.herokuapp.com/api/v1/${game._id}`)
      dispatch(loadGame(res?.data as Game))
    } else {
      const res = await axios.get(`https://poker-board.herokuapp.com/api/v1/`)
      dispatch(loadAll(res?.data.reverse() as GameName[]))
    }
  }

  useEffect(() => {
    async function fetchAllGames() {
      const res = await axios.get('https://poker-board.herokuapp.com/api/v1')
      dispatch(loadAll(res?.data.reverse() as GameName[]))
    }
    fetchAllGames()
  }, [dispatch])

  return (
    <div className="md:flex md:justify-center">
      <NavBar />
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
      <div className="mt-16 md:max-w-screen-md md:w-full md:bg-gray-100">
        <PullToRefresh onRefresh={handleRefresh} pullingContent={<PullContent />} refreshingContent={<OnPullRequest />}>
          <div className="h-screen">
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
        </PullToRefresh>
      </div>
    </div>
  )
}
