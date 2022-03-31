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
export const getLowercasePlayers = createSelector([getChatRoyaleState], (state) => {
  return _.map(state.players, (p) => p.toLowerCase())
})

export const getGameState = createSelector([getChatRoyaleState], (state) => {
  return state.gameState
})

export const getGameRules = createSelector([getChatRoyaleState], (state) => {
  const { prompt, duplicatesAllowed, timer, nonce } = state
  return { prompt, duplicatesAllowed, timer, nonce }
})

export const getMyState = createSelector([getChatRoyaleState, getUserState], (state, user) => {
  const myName = user.username!
  const { gameState, players, losers } = state

  if (gameState === 'Disconnected') {
    return 'Reconnecting...'
  }

  if (gameState === 'Not connected') {
    return 'Connecting...'
  }

  if (gameState === 'End of game') {
    return 'The game ended'
  }

  const lowercaseLosers = _.map(losers, (s) => s.toLowerCase())
  const didILose = _.includes(lowercaseLosers, myName.toLowerCase())
  if (didILose) {
    return 'You lost! 😭'
  }

  const lowercasePlayers = _.map(players, (s) => s.toLowerCase())
  const amIPlaying = _.includes(lowercasePlayers, myName.toLowerCase())

  if (!amIPlaying) {
    if (gameState === 'Waiting for game to start') {
      return 'Type anything to join'
    }
    return 'The game started without you. 😢'
  }

  return 'You are playing'
})
