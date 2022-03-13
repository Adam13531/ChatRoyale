import _ from 'lodash'
import { createSelector } from 'reselect'

import { ApplicationState } from 'store/reducers'

/**
 * Returns the Chat Royale state.
 * @param  state - The Redux state.
 * @return The Chat Royale state.
 */
const getChatRoyaleState = (state: ApplicationState) => state.chatRoyale
const getUserState = (state: ApplicationState) => state.user

export const getPlayers = createSelector([getChatRoyaleState], (state) => {
  return state.players
})

export const getGameState = createSelector([getChatRoyaleState], (state) => {
  return state.gameState
})

export const getMyState = createSelector([getChatRoyaleState, getUserState], (state, user) => {
  const myName = user.username!
  const { gameState, players } = state

  if (gameState === 'Disconnected') {
    return 'Reconnecting...'
  }

  if (gameState === 'Not connected') {
    return 'Connecting...'
  }

  const lowercasePlayers = _.map(players, (s) => s.toLowerCase())
  const amIPlaying = _.includes(lowercasePlayers, myName.toLowerCase())
  const myState = amIPlaying ? 'You are playing' : 'Type anything to join'

  return myState
})
