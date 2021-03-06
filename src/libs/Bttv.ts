import _ from 'lodash'

import EmotesProvider, { Emote, EmoteProviderPrefix } from 'libs/EmotesProvider'

/**
 * Bttv base API URL.
 */
const baseAPIUrl = 'https://api.betterttv.net/3/cached'

/**
 * Bttv class.
 */
export default class Bttv {
  /**
   * Fetches Bttv emotes & bots for a specific channel.
   * @param channelId - The channel id.
   * @return The emotes provider and bots details.
   */
  public static async fetchEmotesAndBots(channelId: string): Promise<BttvEmotesAndBots> {
    const response = await Promise.all([
      (await Bttv.fetch(`${baseAPIUrl}/emotes/global`)).json(),
      (await Bttv.fetch(`${baseAPIUrl}/users/twitch/${channelId}`)).json(),
    ])

    const [globalResponse, channelResponse] = response

    const isChannelRegistered = channelResponse.message !== 'user not found'

    let rawEmotes: BttvRawEmote[] = isChannelRegistered
      ? [...globalResponse, ...channelResponse.sharedEmotes, ...channelResponse.channelEmotes]
      : globalResponse

    const bots: BttvEmotesAndBots['bots'] = isChannelRegistered ? channelResponse.bots : null

    const emotes = new EmotesProvider(
      EmoteProviderPrefix.Bttv,
      Bttv.sanitizeRawEmotes(rawEmotes),
      'https://cdn.betterttv.net/emote/{{id}}/{{image}}',
      'x'
    )

    return {
      bots,
      emotes,
    }
  }

  /**
   * Sanitizes emotes returned by the Ffz API.
   * @param  rawEmotes - The emotes returned by the API.
   * @return The sanitized emotes.
   */
  private static sanitizeRawEmotes(rawEmotes: BttvRawEmote[]): BttvEmote[] {
    return _.map(rawEmotes, ({ code, id, imageType }) => {
      return {
        name: code,
        id: id.toString(),
        imageType,
      }
    })
  }

  /**
   * Fetches an URL.
   * @param  url - The URL to fetch.
   * @param  additionalHeaders -  Additional headers to pass down to the query.
   * @return The response.
   */
  private static fetch(url: string, additionalHeaders?: Record<string, string>) {
    const headers = new Headers({
      Accept: 'application/json',
    })

    if (_.size(additionalHeaders) > 0) {
      _.forEach(additionalHeaders, (value, name) => {
        headers.append(name, value)
      })
    }

    const request = new Request(url, { headers })

    return fetch(request)
  }
}

/**
 * Bttv emote.
 */
interface BttvEmote extends Emote {
  imageType: string
}

/**
 * Bttv raw emote returned by the API.
 */
interface BttvRawEmote {
  id: number
  code: string
  imageType: string
}

/**
 * Bttv emotes and bots details.
 */
type BttvEmotesAndBots = {
  bots: string[] | null
  emotes: EmotesProvider<BttvEmote>
}
