import { Reducer } from 'redux'
import { createAction } from 'utils/redux'

/**
 * Actions types.
 */
export enum Actions {
  SET_PLAYERS = 'royale/SET_PLAYERS',
  SET_GAME_STATE = 'royale/SET_GAME_STATE',
  SET_MY_STATE = 'royale/SET_MY_STATE',
}

/**
 * Initial state.
 */
export const initialState = {
  players: [],
  gameState: 'Not connected',
  myState: 'Connecting...',
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
    case Actions.SET_GAME_STATE: {
      return {
        ...state,
        gameState: action.payload.gameState,
      }
    }
    case Actions.SET_MY_STATE: {
      return {
        ...state,
        myState: action.payload.myState,
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
export const setGameState = (gameState: string) =>
  createAction(Actions.SET_GAME_STATE, {
    gameState,
  })
export const setMyState = (myState: string) =>
  createAction(Actions.SET_MY_STATE, {
    myState,
  })

/**
 * Chat Royale actions.
 */
export type ChatRoyaleActions =
  | ReturnType<typeof setPlayers>
  | ReturnType<typeof setGameState>
  | ReturnType<typeof setMyState>

/**
 * Chat Royale state.
 */
export type ChatRoyaleState = {
  players: string[]
  gameState: string
  myState: string
}
