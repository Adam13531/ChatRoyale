import _ from 'lodash'

export enum ChatRoyaleEvent {
  LogToChat,
  SetPlayers,
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
  private static gameState: GameState = GameState.Idle
  private static allPlayers: string[]
  private static username?: string

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

  public static setUsername(username: string) {
    ChatRoyale.username = username
  }

  private static amIPlaying(): boolean {
    const lowercasePlayers = _.map(ChatRoyale.allPlayers, (s) => s.toLowerCase())

    return _.includes(lowercasePlayers, ChatRoyale.username?.toLowerCase())
  }

  private static onMessage(evt: MessageEvent) {
    try {
      const parsed = JSON.parse(evt.data)
      ChatRoyale.log(`Got a JSON message of type "${parsed.type}": ${evt.data}`)
      if (parsed.type === 'STATE') {
        ChatRoyale.gameState = parsed.currentState
        ChatRoyale.allPlayers = parsed.players
        ChatRoyale.callHandler<LogToChatHandler>(ChatRoyaleEvent.SetPlayers, parsed.players)
        ChatRoyale.log(`amIPlaying: ${ChatRoyale.amIPlaying()}`)
      }
    } catch (e) {
      ChatRoyale.log("Got a message that wasn't JSON: " + evt.data)
    }
  }

  private static onClose() {
    if (ChatRoyale.printCloseMessage) {
      ChatRoyale.log('WebSocket connection closed. Entering reconnect loop.')
      ChatRoyale.printCloseMessage = false
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
type SetPlayersHandler = (players: string[]) => void
