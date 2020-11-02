/* eslint-disable indent */
import { combineReducers } from 'redux'

import {
  PokerBoardState,
  Actions,
  LOAD_ALL_GAMES,
  LOAD_GAME,
  DISPLAY_CREATE_GAME,
  DISPLAY_GAME_LIST,
  DISPLAY_GAME_CARD,
  DISPLAY_GAME_SELECT,
  DISPLAY_ADD_PLAYER,
  DISPLAY_ADD_TRANSACTION,
  DISPLAY_SETTLE_DEBTS,
  DISPLAY_RELOAD,
} from '../../types'

const initialState: PokerBoardState = {
  allGames: undefined,
  game: undefined,
  showGameSelect: true,
  showGameList: false,
  showGameCard: false,
  showCreateGame: false,
  showAddPlayer: false,
  showAddTransaction: false,
  showSettleDebts: false,
  showReload: false,
}

function pokerBoard(state: PokerBoardState = initialState, action: Actions): PokerBoardState {
  switch (action.type) {
    case LOAD_ALL_GAMES: {
      return { ...state, ...action.payload }
    }
    case LOAD_GAME: {
      return { ...state, ...action.payload }
    }
    case DISPLAY_CREATE_GAME: {
      return { ...state, ...action.payload }
    }
    case DISPLAY_GAME_LIST: {
      return { ...state, ...action.payload }
    }
    case DISPLAY_GAME_CARD: {
      return { ...state, ...action.payload }
    }
    case DISPLAY_GAME_SELECT: {
      return { ...state, ...action.payload }
    }
    case DISPLAY_ADD_PLAYER: {
      return { ...state, ...action.payload }
    }
    case DISPLAY_ADD_TRANSACTION: {
      return { ...state, ...action.payload }
    }
    case DISPLAY_SETTLE_DEBTS: {
      return { ...state, ...action.payload }
    }
    case DISPLAY_RELOAD: {
      return { ...state, ...action.payload }
    }
    default:
      return state
  }
}

const createRootReducer = () => combineReducers({ pokerBoard })

export default createRootReducer
