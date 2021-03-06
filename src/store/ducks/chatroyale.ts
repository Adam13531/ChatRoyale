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
  SET_LOSS_REASON = 'royale/SET_LOSS_REASON',
  SET_GAME_STATE = 'royale/SET_GAME_STATE',
  SET_GAME_RULES = 'royale/SET_GAME_RULES',
}

/**
 * Initial state.
 */
export const initialState = {
  players: [],
  losers: [],

  // This is never cleared out and really has no reason to even be in this
  // state. I'm speed-coding. 😳
  lossReason: null,
  gameState: 'Not connected',
  prompt: '',

  // Just some random string so that we can differentiate when setGameRules is
  // called. It's mostly for testing since, at the moment, I don't have multiple
  // prompts to differentiate rounds.
  nonce: '',
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
        losers: action.payload.losers,
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
        losers: [...state.losers, action.payload.player],
      }
    }
    case Actions.SET_LOSS_REASON: {
      return {
        ...state,
        lossReason: action.payload.reason,
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
        nonce: action.payload.nonce,
      }
    }
    default: {
      return state
    }
  }
}

export default chatRoyaleReducer

export const setPlayers = (players: string[], losers: string[]) =>
  createAction(Actions.SET_PLAYERS, {
    players,
    losers,
  })
export const addPlayer = (player: string) =>
  createAction(Actions.ADD_PLAYER, {
    player,
  })
export const playerLost = (player: string) =>
  createAction(Actions.PLAYER_LOST, {
    player,
  })
export const setLossReason = (reason: string) =>
  createAction(Actions.SET_LOSS_REASON, {
    reason,
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
    nonce: _.uniqueId('prompt-timer'),
  })

/**
 * Chat Royale actions.
 */
export type ChatRoyaleActions =
  | ReturnType<typeof setPlayers>
  | ReturnType<typeof addPlayer>
  | ReturnType<typeof playerLost>
  | ReturnType<typeof setLossReason>
  | ReturnType<typeof setGameState>
  | ReturnType<typeof setGameRules>

/**
 * Chat Royale state.
 */
export type ChatRoyaleState = {
  players: string[]
  losers: string[]
  lossReason: string | null
  gameState: string
  prompt: string
  nonce: string
  duplicatesAllowed: boolean
  timer: number
}
