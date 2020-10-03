export type Transaction = {
  _id: string
  ownerId: string
  counterPartyId: string
  refId: string
  description: string
  amount: number
  createdAt: string
}

export type Player = {
  _id: string
  name: string
  balance: number
  transactions: Transaction[]
}

export type GameName = {
  _id: string
  name: string
}

export type Game = {
  _id: string
  name: string
  buyIn: number
  players: Player[]
  createdAt: string
  updatedAt: string
  gameClosed: boolean
}

export type SVGProps = {
  className: string
}

export const LOAD_GAME = 'LOAD_GAME'
export const LOAD_ALL_GAMES = 'LOAD_ALL_GAMES'
export const DISPLAY_GAME_SELECT = 'DISPLAY_GAME_SELECT'
export const DISPLAY_GAME_LIST = 'DISPLAY_GAME_LIST'
export const DISPLAY_CREATE_GAME = 'DISPLAY_CREATE_GAME'
export const DISPLAY_GAME_CARD = 'DISPLAY_GAME_CARD'

export type LoadAllGamesAction = {
  type: typeof LOAD_ALL_GAMES
  payload: {
    allGames: GameName[]
  }
}

export type LoadGameAction = {
  type: typeof LOAD_GAME
  payload: {
    game: Game | undefined
  }
}

export type DisplayGameSelectAction = {
  type: typeof DISPLAY_GAME_SELECT
  payload: {
    showGameSelect: boolean
  }
}

export type DisplayGameListAction = {
  type: typeof DISPLAY_GAME_LIST
  payload: {
    showGameList: boolean
  }
}

export type DisplayGameCardAction = {
  type: typeof DISPLAY_GAME_CARD
  payload: {
    showGameCard: boolean
  }
}

export type DisplayCreateGameAction = {
  type: typeof DISPLAY_CREATE_GAME
  payload: {
    showCreateGame: boolean
  }
}

export type Actions =
  | LoadAllGamesAction
  | LoadGameAction
  | DisplayGameSelectAction
  | DisplayGameListAction
  | DisplayGameCardAction
  | DisplayCreateGameAction

export type PokerBoardState = {
  allGames: GameName[] | undefined
  game: Game | undefined
  showGameSelect: boolean
  showGameList: boolean
  showGameCard: boolean
  showCreateGame: boolean
}

export type AppState = {
  pokerBoard: PokerBoardState
}
