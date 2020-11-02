import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch, batch } from 'react-redux'
import PullToRefresh from 'react-simple-pull-to-refresh'
import axios from 'axios'

import api from './api'
import { Transition, Popup, PullContent, OnPullRequest } from './components'
import { CreateGame, FunctionBar, GameCard, GameSelect, NavBar } from './containers'
import { loadAll, loadGame } from './redux/actions'
import { AppState, GameName } from './types'
import './tailwind.output.css'

export default function App() {
  const dispatch = useDispatch()
  const [showPopup, displayPopup] = useState(true)
  const game = useSelector((state: AppState) => state.pokerBoard.game)
  const showGameCard = useSelector((state: AppState) => state.pokerBoard.showGameCard)
  const showCreateGame = useSelector((state: AppState) => state.pokerBoard.showCreateGame)
  const showGameSelect = useSelector((state: AppState) => state.pokerBoard.showGameSelect)

  const handleRefresh = async () => {
    const requests = [api.get(`/`)]
    if (game) requests.push(api.get(`/${game._id}`))
    axios.all(requests).then(
      axios.spread((...responses) => {
        batch(() => {
          dispatch(loadAll(responses[0].data.reverse()))
          if (responses.length > 1) dispatch(loadGame(responses[1]?.data))
        })
      })
    )
  }

  useEffect(() => {
    async function fetchAllGames() {
      const res = await api.get<GameName[]>('/')
      dispatch(loadAll(res?.data.reverse()))
    }
    fetchAllGames()
  }, [dispatch])

  return (
    <div className="md:flex md:justify-center">
      <NavBar />
      <Transition showCondition={showPopup}>
        <Popup
          type="info"
          title="Disclaimer"
          message="Poker Board is a free tool available to the world. By continuing you agree to publicly share any data posted to Poker Board. It means everyone will know how bad you are at poker :)"
          confirmBtnLabel="I agree to share my data"
          confirmHandler={() => displayPopup(false)}
        />
      </Transition>
      <div className="mt-16 md:max-w-screen-md md:w-full md:bg-gray-100">
        <PullToRefresh onRefresh={handleRefresh} pullingContent={<PullContent />} refreshingContent={<OnPullRequest />}>
          <div className="h-screen pb-10">
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
