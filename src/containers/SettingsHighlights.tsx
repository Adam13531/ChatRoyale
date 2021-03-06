import { Classes, Intent, TagInput } from '@blueprintjs/core'
import _ from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'

import FlexContent from 'components/FlexContent'
import FlexLayout from 'components/FlexLayout'
import NonIdealState from 'components/NonIdealState'
import SettingsHighlight from 'components/SettingsHighlight'
import SettingsHighlightColorMenu from 'components/SettingsHighlightColorMenu'
import SettingsInput from 'components/SettingsInput'
import SettingsTable from 'components/SettingsTable'
import SettingsView from 'components/SettingsView'
import Key from 'constants/key'
import Highlight, { HighlightColors } from 'libs/Highlight'
import {
  addHighlight,
  addHighlightsIgnoredUsers,
  addHighlightsPermanentUsers,
  removeHighlight,
  removeHighlightsIgnoredUser,
  removeHighlightsPermanentUser,
  updateHighlightColor,
  updateHighlightPattern,
} from 'store/ducks/settings'
import { ApplicationState } from 'store/reducers'
import { getHighlights, getHighlightsIgnoredUsers, getHighlightsPermanentUsers } from 'store/selectors/settings'
import styled from 'styled'

/**
 * Wrapper component.
 */
const Wrapper = styled(SettingsView)`
  & > div,
  & > section {
    flex-shrink: 0;
  }
`

/**
 * Notice component.
 */
const Notice = styled.div`
  font-style: italic;
  margin-bottom: 20px;
`

/**
 * Form component.
 */
const Form = styled(FlexContent)`
  overflow-y: initial;
`

/**
 * UsersInput component.
 */
const UsersInput = styled(TagInput)`
  margin-bottom: 10px;

  &:last-of-type {
    margin-bottom: 0;
  }

  & > .${Classes.TAG_INPUT_VALUES}, &.${Classes.INPUT}, &.${Classes.TAG_INPUT} {
    max-height: 30px;
    overflow-y: auto;
  }

  & > .${Classes.TAG_INPUT_VALUES} {
    overflow-y: auto;
  }
`

/**
 * React State.
 */
const initialState = { newHighlight: '', newHighlightIntent: Intent.NONE as Intent, newColor: HighlightColors.Yellow }
type State = Readonly<typeof initialState>

/**
 * SettingsHighlights Component.
 */
class SettingsHighlights extends React.Component<Props, State> {
  public state: State = initialState
  private newHighlightInput: HTMLInputElement | null = null

  /**
   * Renders the component.
   * @return Element to render.
   */
  public render() {
    const { newColor, newHighlight, newHighlightIntent } = this.state
    const { highlights, ignoredUsers, permanentUsers } = this.props

    return (
      <Wrapper>
        <Notice>Case-insensitive. Username included by default.</Notice>
        <FlexLayout>
          <Form>
            <SettingsInput
              inputRef={this.setNewHighlightInputRef}
              intent={newHighlightIntent}
              placeholder="Add a new highlight???"
              value={newHighlight}
              onChange={this.onChangeNewHighlight}
              onKeyDown={this.onKeyDownNewHighlight}
            />
          </Form>
          <SettingsHighlightColorMenu color={newColor} onSelect={this.onSelectColor} />
        </FlexLayout>
        <SettingsTable>
          {_.size(highlights) > 0 ? (
            _.map(highlights, (highlight) => (
              <SettingsHighlight
                key={highlight.id}
                highlight={highlight}
                validate={this.validate}
                updateColor={this.props.updateHighlightColor}
                updatePattern={this.props.updateHighlightPattern}
                remove={this.props.removeHighlight}
              />
            ))
          ) : (
            <NonIdealState small title="No highlight yet!" details="Try adding some above." />
          )}
        </SettingsTable>
        <UsersInput
          placeholder="Ignore highlights from users??? (space-separated list)"
          onRemove={this.onRemoveIgnoredUser}
          onAdd={this.onAddIgnoredUsers}
          values={ignoredUsers}
          leftIcon="blocked-person"
          separator=" "
          fill
        />
        <UsersInput
          placeholder="Highlight all messages from users??? (space-separated list)"
          onRemove={this.onRemovePermanentUser}
          onAdd={this.onAddPermanentUsers}
          values={permanentUsers}
          leftIcon="new-person"
          separator=" "
          fill
        />
      </Wrapper>
    )
  }

  /**
   * Sets the new highlight input ref.
   * @param ref - The reference to the inner input element.
   */
  private setNewHighlightInputRef = (ref: HTMLInputElement | null) => {
    this.newHighlightInput = ref
  }

  /**
   * Triggered when a new color is picked.
   * @param newColor - The new color name.
   */
  private onSelectColor = (newColor: HighlightColors) => {
    this.setState(() => ({ newColor }))

    if (!_.isNil(this.newHighlightInput)) {
      this.newHighlightInput.focus()
    }
  }

  /**
   * Triggered when one or more ignored user(s) are added.
   * @param usernames - The ignored usernames.
   */
  private onAddIgnoredUsers = (usernames: string[]) => {
    this.props.addHighlightsIgnoredUsers(_.map(usernames, _.toLower))
  }

  /**
   * Triggered when an ignored user is removed.
   * @param username - The ignored username.
   */
  private onRemoveIgnoredUser = (username: React.ReactNode) => {
    if (_.isString(username)) {
      this.props.removeHighlightsIgnoredUser(username)
    }
  }

  /**
   * Triggered when one or more permanent user(s) are added.
   * @param usernames - The permanent usernames.
   */
  private onAddPermanentUsers = (usernames: string[]) => {
    this.props.addHighlightsPermanentUsers(_.map(usernames, _.toLower))
  }

  /**
   * Triggered when a permanent user is removed.
   * @param username - The permanent username.
   */
  private onRemovePermanentUser = (username: React.ReactNode) => {
    if (_.isString(username)) {
      this.props.removeHighlightsPermanentUser(username)
    }
  }

  /**
   * Triggered when the new highlight value is modified.
   * @param event - The associated event.
   */
  private onChangeNewHighlight = (event: React.FormEvent<HTMLInputElement>) => {
    const newHighlight = event.currentTarget.value

    let newHighlightIntent: Intent = Intent.DANGER

    if (newHighlight.length === 0) {
      newHighlightIntent = Intent.NONE
    } else if (this.validate(newHighlight)) {
      newHighlightIntent = Intent.SUCCESS
    }

    this.setState(() => ({ newHighlight, newHighlightIntent }))
  }

  /**
   * Triggered when a key is pressed down in the new highlight input.
   * @param event - The associated event.
   */
  private onKeyDownNewHighlight = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === Key.Enter) {
      event.preventDefault()

      const { newColor, newHighlight } = this.state

      if (this.validate(newHighlight)) {
        const highlight = new Highlight(newHighlight, newColor)

        this.props.addHighlight(highlight.serialize())

        this.setState(initialState)
      }
    }
  }

  /**
   * Validates a highlight.
   * @param  pattern - The highlight pattern to validate.
   * @return `true` if the highlight is valid.
   */
  private validate = (pattern: string) => {
    return Highlight.validate(pattern, this.props.highlights)
  }
}

export default connect<StateProps, DispatchProps, {}, ApplicationState>(
  (state) => ({
    highlights: getHighlights(state),
    ignoredUsers: getHighlightsIgnoredUsers(state),
    permanentUsers: getHighlightsPermanentUsers(state),
  }),
  {
    addHighlight,
    addHighlightsIgnoredUsers,
    addHighlightsPermanentUsers,
    removeHighlight,
    removeHighlightsIgnoredUser,
    removeHighlightsPermanentUser,
    updateHighlightColor,
    updateHighlightPattern,
  }
)(SettingsHighlights)

/**
 * React Props.
 */
interface StateProps {
  highlights: ReturnType<typeof getHighlights>
  ignoredUsers: ReturnType<typeof getHighlightsIgnoredUsers>
  permanentUsers: ReturnType<typeof getHighlightsPermanentUsers>
}

/**
 * React Props.
 */
interface DispatchProps {
  addHighlight: typeof addHighlight
  addHighlightsIgnoredUsers: typeof addHighlightsIgnoredUsers
  addHighlightsPermanentUsers: typeof addHighlightsPermanentUsers
  removeHighlight: typeof removeHighlight
  removeHighlightsIgnoredUser: typeof removeHighlightsIgnoredUser
  removeHighlightsPermanentUser: typeof removeHighlightsPermanentUser
  updateHighlightColor: typeof updateHighlightColor
  updateHighlightPattern: typeof updateHighlightPattern
}

/**
 * React Props.
 */
type Props = StateProps & DispatchProps
