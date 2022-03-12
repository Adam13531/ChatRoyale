import { createSelector } from 'reselect'

import { ApplicationState } from 'store/reducers'

/**
 * Returns the Chat Royale state.
 * @param  state - The Redux state.
 * @return The Chat Royale state.
 */
const getChatRoyaleState = (state: ApplicationState) => state.chatRoyale

export const getPlayers = createSelector([getChatRoyaleState], (state) => {
  return state.players
})
