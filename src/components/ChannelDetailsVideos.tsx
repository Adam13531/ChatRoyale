import _ from 'lodash'
import pluralize from 'pluralize'
import { Component } from 'react'

import { ChannelDetailsProps } from 'components/ChannelDetails'
import { ChannelDetailsType } from 'components/ChannelDetailsOverview'
import ChannelDetailsPanel from 'components/ChannelDetailsPanel'
import ExternalResource, { Resource, ResourceType } from 'components/ExternalResource'
import NonIdealState from 'components/NonIdealState'
import Spinner from 'components/Spinner'
import Twitch, { ClipPeriod } from 'libs/Twitch'
import styled, { theme, ThemeProps, withTheme } from 'styled'

/**
 * ChannelDetailsVideo component.
 */
const ChannelDetailsVideo = styled(ExternalResource)`
  &:hover {
    background-color: ${theme('channel.background')};
  }
`

/**
 * React State.
 */
const initialState = { didFail: false, videos: undefined as Optional<Resource[]> }
type State = Readonly<typeof initialState>

/**
 * ChannelDetailsVideos Component.
 */
class ChannelDetailsVideos extends Component<ChannelDetailsProps & Props & ThemeProps, State> {
  public state: State = initialState

  /**
   * Lifecycle: componentDidMount.
   */
  public async componentDidMount() {
    const { id, type } = this.props

    try {
      if (type === ChannelDetailsType.LastVods) {
        const videos = await Twitch.fetchChannelVideos(id, 10)

        const parsedVideos = _.map(videos, (video) => ({
          id: video.id,
          meta: `${new Date(video.created_at).toLocaleDateString()} - ${video.view_count.toLocaleString()} ${pluralize(
            'views',
            video.view_count
          )}`,
          text: video.title,
          thumbnail: Twitch.getTwitchTemplatedUrl(video.thumbnail_url, {
            width: this.props.theme.external.thumbnail.width.toString(),
            height: this.props.theme.external.thumbnail.height.toString(),
          }),
          type: ResourceType.Vod,
          url: video.url,
        }))

        this.setState(() => ({ didFail: false, videos: parsedVideos }))
      } else if (type === ChannelDetailsType.TopClips || type === ChannelDetailsType.RecentClips) {
        const period = type === ChannelDetailsType.TopClips ? ClipPeriod.All : ClipPeriod.Week

        const clips = await Twitch.fetchTopClips(id, period)

        const parsedVideos = _.map(clips, (clip) => ({
          id: clip.id,
          meta: `${new Date(clip.created_at).toLocaleDateString()} - ${clip.view_count.toLocaleString()} ${pluralize(
            'views',
            clip.view_count
          )} - ${clip.creator_name}`,
          text: clip.title,
          thumbnail: clip.thumbnail_url,
          type: ResourceType.Clip,
          url: clip.url,
        }))

        this.setState(() => ({ didFail: false, videos: parsedVideos }))
      } else {
        this.setState(() => ({ didFail: true }))
      }
    } catch {
      this.setState(() => ({ didFail: true }))
    }
  }

  /**
   * Renders the component.
   * @return Element to render.
   */
  public render() {
    const { didFail, videos } = this.state

    if (didFail) {
      return <NonIdealState small retry />
    }

    if (_.isUndefined(videos)) {
      return <Spinner />
    }

    if (_.isNil(videos) || _.size(videos) === 0) {
      return <NonIdealState small title="Nothing yet!" retry />
    }

    return (
      <ChannelDetailsPanel minimal>
        {_.map(videos, (video) => (
          <ChannelDetailsVideo key={video.id} resource={video} />
        ))}
      </ChannelDetailsPanel>
    )
  }
}

export default withTheme(ChannelDetailsVideos)

/**
 * React Props.
 */
interface Props {
  type: VideoType
}

/**
 * Channel video type.
 */
type VideoType = ChannelDetailsType.LastVods | ChannelDetailsType.RecentClips | ChannelDetailsType.TopClips

/**
 * Channel details video.
 */
export type Video = {
  id: string
  meta: string
  thumbnail: string
  title: string
  type: VideoType
  url: string
}
