export enum ChatRoyaleEvent {
  LogToChat,
}

export default class ChatRoyale {
  private static ws: Optional<WebSocket>
  private static handlers: { [key in ChatRoyaleEvent]?: () => void } = {}

  public static connect() {
    ChatRoyale.log('Connecting to ChatRoyale')

    ChatRoyale.ws = new WebSocket('ws://localhost:7896/echo')
    ChatRoyale.ws.onopen = ChatRoyale.onOpen
    ChatRoyale.ws.onmessage = ChatRoyale.onMessage
    ChatRoyale.ws.onclose = ChatRoyale.onClose
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
    ChatRoyale.ws!.send('Message to send')
  }

  private static onMessage(evt: MessageEvent) {
    ChatRoyale.log('Received message: ' + evt.data)
  }

  private static onClose() {
    ChatRoyale.log('WebSocket connection closed')
  }

  private static log(msg: string) {
    console.log(msg)
    ChatRoyale.callHandler<LogToChatHandler>(ChatRoyaleEvent.LogToChat, msg)
  }
}

type LogToChatHandler = (test: string) => void
