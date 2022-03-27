import _ from 'lodash'

export enum ChatRoyaleEvent {
  LogToChat,
  SetPlayers,
  AddPlayer,
  PlayerLost,
  SetGameState,
  SetGameRules,
  PlayerWon,
}

const RECONNECT_INTERVAL = 5000

enum GameState {
  Idle = 1, // waiting for a command to start things
  Lobby, // players can register themselves
  Round, // playing a round
  InBetween, // between rounds. Waiting for a command to start the next round.
  End, // The game is over
}

export default class ChatRoyale {
  private static ws: Optional<WebSocket>
  private static handlers: { [key in ChatRoyaleEvent]?: () => void } = {}
  private static reconnectTimeout?: number
  private static printCloseMessage: boolean = false

  public static connect() {
    ChatRoyale.ws = new WebSocket('ws://localhost:7896/echo')
    ChatRoyale.ws.onopen = ChatRoyale.onOpen
    ChatRoyale.ws.onmessage = ChatRoyale.onMessage
    ChatRoyale.ws.onclose = ChatRoyale.onClose
  }

  public static isConnected(): boolean {
    return !_.isNil(ChatRoyale.ws) && (ChatRoyale.ws.readyState === 0 || ChatRoyale.ws.readyState === 1)
  }

  private static startReconnectCycle() {
    if (ChatRoyale.reconnectTimeout) {
      window.clearTimeout(ChatRoyale.reconnectTimeout)
    }
    ChatRoyale.reconnectTimeout = window.setInterval(() => {
      ChatRoyale.reconnect()
    }, RECONNECT_INTERVAL)
  }

  private static reconnect() {
    ChatRoyale.disconnect()
    ChatRoyale.connect()
  }

  public static disconnect() {
    if (ChatRoyale.reconnectTimeout) {
      window.clearTimeout(ChatRoyale.reconnectTimeout)
    }

    if (ChatRoyale.ws) {
      ChatRoyale.ws.removeEventListener('open', ChatRoyale.onOpen)
      ChatRoyale.ws.removeEventListener('message', ChatRoyale.onMessage)
      ChatRoyale.ws.removeEventListener('close', ChatRoyale.onClose)

      ChatRoyale.ws.close()
      ChatRoyale.ws = undefined
    }
  }

  public static addHandler(type: ChatRoyaleEvent.LogToChat, handler: LogToChatHandler): void
  public static addHandler(type: ChatRoyaleEvent.SetPlayers, handler: SetPlayersHandler): void
  public static addHandler(type: ChatRoyaleEvent.AddPlayer, handler: AddPlayerHandler): void
  public static addHandler(type: ChatRoyaleEvent.PlayerLost, handler: PlayerLostHandler): void
  public static addHandler(type: ChatRoyaleEvent.SetGameState, handler: SetGameStateHandler): void
  public static addHandler(type: ChatRoyaleEvent.SetGameRules, handler: SetGameRulesHandler): void
  public static addHandler(type: ChatRoyaleEvent.PlayerWon, handler: PlayerWonHandler): void
  public static addHandler(type: ChatRoyaleEvent, handler: (...args: any) => void) {
    ChatRoyale.handlers[type] = handler
  }

  private static callHandler<EventHandler extends Function>(
    type: ChatRoyaleEvent,
    ...args: ArgumentTypes<EventHandler>
  ): void {
    const handler = ChatRoyale.handlers[type] as Optional<EventHandler>

    if (handler) {
      handler(...args)
    }
  }

  private static onOpen() {
    ChatRoyale.log('Connected via WebSocket')
    ChatRoyale.printCloseMessage = true
    ChatRoyale.ws!.send('Message to send')

    // Now that we've connected, we don't need to try to reconnect anymore.
    window.clearTimeout(ChatRoyale.reconnectTimeout)
  }

  public static getStateStringFromState(state: GameState): string {
    switch (state) {
      case GameState.Idle:
        return 'Waiting for server to start'
      case GameState.Lobby:
        return 'Waiting for game to start'
      case GameState.Round:
        return 'Mid-game'
      case GameState.InBetween:
        return 'Waiting for the next round to start'
      case GameState.End:
        return 'End of game'
      default:
        return 'Unrecognized game state'
    }
  }

  private static onMessage(evt: MessageEvent) {
    try {
      const parsed = JSON.parse(evt.data)
      console.log(`Got a JSON message of type "${parsed.type}": ${evt.data}`)
      if (parsed.type === 'STATE') {
        ChatRoyale.callHandler<SetPlayersHandler>(ChatRoyaleEvent.SetPlayers, parsed.players, parsed.losers)
        const gameStateString = ChatRoyale.getStateStringFromState(parsed.gameState)
        ChatRoyale.callHandler<SetGameStateHandler>(ChatRoyaleEvent.SetGameState, gameStateString)
      } else if (parsed.type === 'ADD_PLAYER') {
        ChatRoyale.callHandler<AddPlayerHandler>(ChatRoyaleEvent.AddPlayer, parsed.player)
      } else if (parsed.type === 'PLAYER_LOST') {
        ChatRoyale.callHandler<PlayerLostHandler>(ChatRoyaleEvent.PlayerLost, parsed.player)
      } else if (parsed.type === 'ROUND_END') {
        const gameStateString = ChatRoyale.getStateStringFromState(parsed.nextState)
        ChatRoyale.callHandler<SetGameStateHandler>(ChatRoyaleEvent.SetGameState, gameStateString)

        if (parsed.nextState === GameState.End) {
          ChatRoyale.callHandler<PlayerWonHandler>(ChatRoyaleEvent.PlayerWon, parsed.winner)
        }
      } else if (parsed.type === 'ROUND_START') {
        const { prompt, duplicatesAllowed, time } = parsed
        ChatRoyale.callHandler<SetGameStateHandler>(ChatRoyaleEvent.SetGameState, 'Mid-game')
        ChatRoyale.callHandler<SetGameRulesHandler>(ChatRoyaleEvent.SetGameRules, prompt, duplicatesAllowed, time)
      }
    } catch (e) {
      console.log("Got a message that wasn't JSON: " + evt.data)
    }
  }

  private static onClose() {
    if (ChatRoyale.printCloseMessage) {
      ChatRoyale.log('WebSocket connection closed. Entering reconnect loop.')
      ChatRoyale.printCloseMessage = false
      ChatRoyale.callHandler<SetGameStateHandler>(ChatRoyaleEvent.SetGameState, 'Disconnected')
      ChatRoyale.callHandler<SetPlayersHandler>(ChatRoyaleEvent.SetPlayers, [], [])
    }

    // Start trying to reconnect in case we never end up connecting in the first
    // place
    ChatRoyale.startReconnectCycle()
  }

  private static log(msg: string) {
    console.log(msg)
    ChatRoyale.callHandler<LogToChatHandler>(ChatRoyaleEvent.LogToChat, msg)
  }
}

type LogToChatHandler = (msg: string) => void
type SetPlayersHandler = (players: string[], losers: string[]) => void
type AddPlayerHandler = (player: string) => void
type PlayerLostHandler = (player: string) => void
type SetGameStateHandler = (gameState: string) => void
type SetGameRulesHandler = (prompt: string, duplicatesAllowed: boolean, timer: number) => void
type PlayerWonHandler = (winner: string) => void
