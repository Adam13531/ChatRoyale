import * as _ from 'lodash'
import * as React from 'react'
import styled from 'styled-components'

import LogType from 'Constants/logType'
import { SerializedMessage } from 'Libs/Message'
import { withSCProps } from 'Utils/react'
import { color } from 'Utils/styled'

/**
 * Message component.
 */
const Message = withSCProps<MessageProps, HTMLSpanElement>(styled.span)`
  color: ${(props) => props.color};
  word-wrap: break-word;

  .emoteWrapper {
    display: inline-block;
    min-width: 28px;
  }

  .emote {
    display: inline-block;
    margin-top: -3px;
    vertical-align: middle;
  }

  .mention {
    background-color: ${color('log.mention.color')};
    border-radius: 2px;
    padding: 1px 3px 2px 3px;

    &.self {
      background-color: ${color('log.mention.self.color')};
    }
  }

  span.cheer {
    font-weight: bold;
  }

  .highlight {
    border-radius: 2px;
    padding: 1px 3px 2px 3px;

    &.Red {
      background-color: ${color('log.highlight.Red.background')};
      color: ${color('log.highlight.Red.color')};
    }

    &.Yellow {
      background-color: ${color('log.highlight.Yellow.background')};
      color: ${color('log.highlight.Yellow.color')};
    }

    &.Green {
      background-color: ${color('log.highlight.Green.background')};
      color: ${color('log.highlight.Green.color')};
    }

    &.Blue {
      background-color: ${color('log.highlight.Blue.background')};
      color: ${color('log.highlight.Blue.color')};
    }
  }
`

/**
 * MessageContent Component.
 */
const MessageContent: React.SFC<Props> = ({ message }) => {
  const isAction = message.type === LogType.Action
  const messageColor = isAction && !_.isNil(message.user.color) ? message.user.color : 'inherit'

  return <Message color={messageColor} dangerouslySetInnerHTML={{ __html: message.message }} />
}

export default MessageContent

/**
 * React Props.
 */
type Props = {
  message: SerializedMessage
}

/**
 * React Props.
 */
type MessageProps = {
  color: string
}
