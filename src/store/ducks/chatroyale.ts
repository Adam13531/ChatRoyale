import _ from 'lodash'
import { Reducer } from 'redux'
import { createAction } from 'utils/redux'

/**
 * Actions types.
 */
export enum Actions {
  SET_PLAYERS = 'royale/SET_PLAYERS',
  ADD_PLAYER = 'royale/ADD_PLAYER',
  SET_GAME_STATE = 'royale/SET_GAME_STATE',
}

/**
 * Initial state.
 */
export const initialState = {
  players: [],
  gameState: 'Not connected',
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
    case Actions.SET_GAME_STATE: {
      return {
        ...state,
        gameState: action.payload.gameState,
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
export const setGameState = (gameState: string) =>
  createAction(Actions.SET_GAME_STATE, {
    gameState,
  })

/**
 * Chat Royale actions.
 */
export type ChatRoyaleActions =
  | ReturnType<typeof setPlayers>
  | ReturnType<typeof addPlayer>
  | ReturnType<typeof setGameState>

/**
 * Chat Royale state.
 */
export type ChatRoyaleState = {
  players: string[]
  gameState: string
}
