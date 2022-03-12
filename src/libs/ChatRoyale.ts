export enum ChatRoyaleEvent {
  LogToChat,
}

const RECONNECT_INTERVAL = 5000

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

  private static startReconnectCycle() {
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

  private static onMessage(evt: MessageEvent) {
    ChatRoyale.log('Received message: ' + evt.data)
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

type LogToChatHandler = (test: string) => void
