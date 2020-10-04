import {
  Game,
  GameName,
  LOAD_ALL_GAMES,
  LOAD_GAME,
  DISPLAY_CREATE_GAME,
  DISPLAY_GAME_LIST,
  DISPLAY_GAME_CARD,
  DISPLAY_GAME_SELECT,
  DISPLAY_ADD_PLAYER,
  DISPLAY_ADD_TRANSACTION,
  DISPLAY_SETTLE_DEBTS,
  Actions,
} from '../../types'

export function loadAll(allGames: GameName[]): Actions {
  return {
    type: LOAD_ALL_GAMES,
    payload: { allGames },
  }
}

export function loadGame(game: Game | undefined): Actions {
  return {
    type: LOAD_GAME,
    payload: { game },
  }
}

export function displayGameSelect(showGameSelect: boolean): Actions {
  return {
    type: DISPLAY_GAME_SELECT,
    payload: { showGameSelect },
  }
}

export function displayGameList(showGameList: boolean): Actions {
  return {
    type: DISPLAY_GAME_LIST,
    payload: { showGameList },
  }
}

export function displayGameCard(showGameCard: boolean): Actions {
  return {
    type: DISPLAY_GAME_CARD,
    payload: { showGameCard },
  }
}

export function displayCreateGame(showCreateGame: boolean): Actions {
  return {
    type: DISPLAY_CREATE_GAME,
    payload: { showCreateGame },
  }
}

export function displayAddPlayer(showAddPlayer: boolean): Actions {
  return {
    type: DISPLAY_ADD_PLAYER,
    payload: { showAddPlayer },
  }
}

export function displayAddTransaction(showAddTransaction: boolean): Actions {
  return {
    type: DISPLAY_ADD_TRANSACTION,
    payload: { showAddTransaction },
  }
}

export function displaySettleDebts(showSettleDebts: boolean): Actions {
  return {
    type: DISPLAY_SETTLE_DEBTS,
    payload: { showSettleDebts },
  }
}
