import _ from 'lodash'
import { Reducer } from 'redux'
import { createAction } from 'utils/redux'

/**
 * Actions types.
 */
export enum Actions {
  SET_PLAYERS = 'royale/SET_PLAYERS',
  ADD_PLAYER = 'royale/ADD_PLAYER',
  PLAYER_LOST = 'royale/PLAYER_LOST',
  SET_GAME_STATE = 'royale/SET_GAME_STATE',
  SET_GAME_RULES = 'royale/SET_GAME_RULES',
}

/**
 * Initial state.
 */
export const initialState = {
  players: [],
  losers: [],
  gameState: 'Not connected',
  prompt: '',
  duplicatesAllowed: false,
  timer: 99,
}

/**
 * Chat Royale reducer.
 * @param  [state=initialState] - Current state.
 * @param  action - Current action.
 * @return The new state.
 */
const chatRoyaleReducer: Reducer<ChatRoyaleState, ChatRoyaleActions> = (state = initialState, action) => {
  switch (action.type) {
    case Actions.SET_PLAYERS: {
      return {
        ...state,
        players: action.payload.players,
      }
    }
    case Actions.ADD_PLAYER: {
      const uniqNames = _.uniqBy([...state.players, action.payload.player], (n) => n.toLowerCase())
      return {
        ...state,
        players: uniqNames,
      }
    }
    case Actions.PLAYER_LOST: {
      const filtered = _.filter(state.players, (p) => p.toLowerCase() !== action.payload.player.toLowerCase())

      return {
        ...state,
        players: filtered,
        losers: [...state.players, action.payload.player],
      }
    }
    case Actions.SET_GAME_STATE: {
      return {
        ...state,
        gameState: action.payload.gameState,
      }
    }
    case Actions.SET_GAME_RULES: {
      return {
        ...state,
        prompt: action.payload.prompt,
        duplicatesAllowed: action.payload.duplicatesAllowed,
        timer: action.payload.timer,
      }
    }
    default: {
      return state
    }
  }
}

export default chatRoyaleReducer

export const setPlayers = (players: string[]) =>
  createAction(Actions.SET_PLAYERS, {
    players,
  })
export const addPlayer = (player: string) =>
  createAction(Actions.ADD_PLAYER, {
    player,
  })
export const playerLost = (player: string) =>
  createAction(Actions.PLAYER_LOST, {
    player,
  })
export const setGameState = (gameState: string) =>
  createAction(Actions.SET_GAME_STATE, {
    gameState,
  })
export const setGameRules = (prompt: string, duplicatesAllowed: boolean, timer: number) =>
  createAction(Actions.SET_GAME_RULES, {
    prompt,
    duplicatesAllowed,
    timer,
  })

/**
 * Chat Royale actions.
 */
export type ChatRoyaleActions =
  | ReturnType<typeof setPlayers>
  | ReturnType<typeof addPlayer>
  | ReturnType<typeof playerLost>
  | ReturnType<typeof setGameState>
  | ReturnType<typeof setGameRules>

/**
 * Chat Royale state.
 */
export type ChatRoyaleState = {
  players: string[]
  losers: string[]
  gameState: string
  prompt: string
  duplicatesAllowed: boolean
  timer: number
}
