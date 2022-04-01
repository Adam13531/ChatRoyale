import _ from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'
import { Colors, Navbar } from '@blueprintjs/core'

import styled from 'styled'
import { ApplicationState } from 'store/reducers'
import { getGameRules, getGameState, getMyState, getPlayers } from 'store/selectors/chatroyale'
import { getChatLoginDetails } from 'store/selectors/user'

const GameStateAndRules = styled(Navbar)`
  position: fixed;
  top: 3px;
  left: 3px;
  // background: ${Colors.DARK_GRAY5};
  // background: ${Colors.WHITE};
  opacity: 0.9;
  // pointer-events: none;
  white-space: normal;
  height: auto;
  font-size: 16px;
`

/**
 * React State.
 */
const initialState = { timer: 0, startTime: 0 }
type State = Readonly<typeof initialState>

/**
 * ChatRoyaleHeader Component.
 */
class ChatRoyaleHeader extends React.Component<Props, State> {
  public state: State = initialState
  private timerId?: number

  public componentDidUpdate(prevProps: Props) {
    if (
      prevProps.gameRules.prompt !== this.props.gameRules.prompt ||
      prevProps.gameRules.nonce !== this.props.gameRules.nonce
    ) {
      this.setState(() => ({
        timer: this.props.gameRules.timer,
        startTime: Date.now(),
      }))
      this.startTimer()
    }
  }

  private startTimer() {
    if (this.timerId == null) {
      this.timerId = window.setInterval(this.updateTimer, 500)
    }
  }

  public componentWillUnmount() {
    this.stopTimer()
  }

  private stopTimer() {
    if (this.timerId != null) {
      window.clearInterval(this.timerId)
      this.timerId = undefined
    }
  }

  private updateTimer = () => {
    const elapsedTime = Date.now() - this.state.startTime
    this.setState(() => ({
      timer: this.props.gameRules.timer - Math.round(elapsedTime / 1000),
    }))
  }

  /**
   * Renders the component.
   * @return Element to render.
   */
  public render() {
    const { gameState, gameRules, myState, players, loginDetails } = this.props
    if (_.isNil(loginDetails)) {
      return null
    }
    const numPlayers = _.size(players)
    const playerPlural = numPlayers === 1 ? 'player' : 'players'
    const playerString = `${numPlayers} ${playerPlural}`
    const { prompt, duplicatesAllowed } = gameRules

    const duplicatesString = duplicatesAllowed ? '(duplicate answers allowed)' : '(unique answers ONLY)'
    const timerColor = this.state.timer >= 0 ? 'unset' : 'red'

    return (
      <GameStateAndRules>
        <div>
          {gameState} | {playerString} | {myState} | Timer:{' '}
          <span style={{ color: timerColor }}>{this.state.timer}s</span>
        </div>
        {prompt && <div style={{ fontWeight: 'bold' }}>Prompt: {prompt}</div>}
        {prompt && <div>{duplicatesString}</div>}
      </GameStateAndRules>
    )
  }
}

export default connect<StateProps, {}, OwnProps, ApplicationState>((state) => ({
  gameState: getGameState(state),
  myState: getMyState(state),
  players: getPlayers(state),
  gameRules: getGameRules(state),
  loginDetails: getChatLoginDetails(state),
}))(ChatRoyaleHeader)

/**
 * React Props.
 */
interface StateProps {
  gameState: ReturnType<typeof getGameState>
  gameRules: ReturnType<typeof getGameRules>
  myState: ReturnType<typeof getMyState>
  players: ReturnType<typeof getPlayers>
  loginDetails: ReturnType<typeof getChatLoginDetails>
}

/**
 * React Props (anything passed in directly and not through Redux)
 */
interface OwnProps {}

/**
 * React Props.
 */
type Props = StateProps & OwnProps
