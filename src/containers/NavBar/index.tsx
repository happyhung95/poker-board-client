import React from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'

import { displayGameSelect, displayCreateGame, displayGameCard, displayReload } from '../../redux/actions'
import { AppState } from '../../types'

export const NavBar = () => {
  const dispatch = useDispatch()
  const game = useSelector((state: AppState) => state.pokerBoard.game)
  const showGameSelect = useSelector((state: AppState) => state.pokerBoard.showGameSelect)
  const showCreateGame = useSelector((state: AppState) => state.pokerBoard.showCreateGame)

  const handleClick = () => {
    if (showGameSelect) {
      // display create game form
      batch(() => {
        dispatch(displayGameSelect(false))
        dispatch(displayGameCard(false))
      })
      setTimeout(() => dispatch(displayCreateGame(true)), 100)
    } else {
      dispatch(displayCreateGame(false))
      setTimeout(() => {
        batch(() => {
          dispatch(displayGameSelect(true))
          if (game) dispatch(displayGameCard(true))
        })
      }, 100)
    }
  }

  return (
    <div
      className="fixed top-0 z-10 md:max-w-screen-md  w-full flex px-4 py-3 items-center justify-between"
      style={{ background: '#8392a3' }}
    >
      <a
        href="https://poker.happyhung.com"
        className="text-white text-2xl font-extrabold font-mono"
        onClick={() => {
          dispatch(displayReload(true))
        }}
      >
        Poker Board
      </a>
      <div
        tabIndex={0}
        role="button"
        onKeyPress={handleClick}
        onClick={handleClick}
        className="px-2 py-1/2 rounded border-2 border-gray-500 bg-gray-500 text-gray-100 text-center text-sm font-bold font-mono outline-none"
        style={{ width: '5.5rem' }}
      >
        {!showCreateGame ? 'New game' : 'Return'}
      </div>
    </div>
  )
}
