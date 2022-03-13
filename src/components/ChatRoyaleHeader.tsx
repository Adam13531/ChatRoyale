import _ from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'

import { ApplicationState } from 'store/reducers'
import { getGameState, getMyState, getPlayers } from 'store/selectors/chatroyale'

/**
 * ChatRoyaleHeader Component.
 */
class ChatRoyaleHeader extends React.Component<Props> {
  /**
   * Renders the component.
   * @return Element to render.
   */
  public render() {
    const { gameState, myState, players } = this.props
    const numPlayers = _.size(players)
    const playerPlural = numPlayers === 1 ? 'player' : 'players'
    const playerString = `${numPlayers} ${playerPlural}`

    return (
      <>
        <div>
          {gameState} | {playerString} | {myState}
        </div>
      </>
    )
  }
}

export default connect<StateProps, {}, OwnProps, ApplicationState>((state) => ({
  gameState: getGameState(state),
  myState: getMyState(state),
  players: getPlayers(state),
}))(ChatRoyaleHeader)

/**
 * React Props.
 */
interface StateProps {
  gameState: ReturnType<typeof getGameState>
  myState: ReturnType<typeof getMyState>
  players: ReturnType<typeof getPlayers>
}

/**
 * React Props (anything passed in directly and not through Redux)
 */
interface OwnProps {}

/**
 * React Props.
 */
type Props = StateProps & OwnProps
