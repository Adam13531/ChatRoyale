import { Reducer } from 'redux'
import { createAction } from 'utils/redux'

/**
 * Actions types.
 */
export enum Actions {
  SET_PLAYERS = 'royale/SET_PLAYERS',
}

/**
 * Initial state.
 */
export const initialState = {
  players: [],
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

/**
 * Chat Royale actions.
 */
export type ChatRoyaleActions = ReturnType<typeof setPlayers>

/**
 * Chat Royale state.
 */
export type ChatRoyaleState = {
  players: string[]
}
