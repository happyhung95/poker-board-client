import { createStore, compose } from 'redux'

import createRootReducer from './reducers'
import { AppState } from '../types'

const initState: AppState = {
  pokerBoard: {
    allGames: undefined,
    game: undefined,
    showGameSelect: true,
    showGameList: false,
    showGameCard: false,
    showCreateGame: false,
    showAddPlayer: false,
    showAddTransaction: false,
    showSettleDebts: false,
  },
}

export default function makeStore(initialState = initState) {
  let composeEnhancers = compose

  if (process.env.NODE_ENV === 'development') {
    if ((window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    }
  }

  return createStore(createRootReducer(), initialState, composeEnhancers())
}
