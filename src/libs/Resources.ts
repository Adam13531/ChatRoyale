import _ from 'lodash'

import Emoticons from 'constants/emoticons'
import EmotesProvider, { Emote, EmoteProviderPrefix, TwitchRegExpEmotesMap } from 'libs/EmotesProvider'
import { PreviewProvider } from 'libs/PreviewProvider'
import { RawBadges, RawCheermote } from 'libs/Twitch'
import { SerializedHighlights } from 'store/ducks/settings'

import PreviewGithub from 'libs/PreviewGithub'
import PreviewStrawPoll from 'libs/PreviewStrawPoll'
import PreviewTwitch from 'libs/PreviewTwitch'
import PreviewYoutube from 'libs/PreviewYoutube'

/**
 * Manager for various resources used mostly during messages parsing like badges, emotes, cheermotes, etc.
 */
export default class Resources {
  /**
   * Returns the manager instance.
   * @class
   */
  public static manager() {
    if (_.isNil(Resources.instance)) {
      Resources.instance = new Resources()
    }

    return Resources.instance
  }

  private static instance: Resources

  private badges: RawBadges = {}
  private bots: Set<string> = new Set(['moobot'])
  private cheermotes: RawCheermote[] = []
  private emotesProviders: Map<EmoteProviderPrefix, EmotesProvider<Emote>> = new Map()
  private highlights: SerializedHighlights = {}
  private highlightsIgnoredUsers: string[] = []
  private highlightsPermanentUsers: string[] = []
  private highlightAllMentions: boolean = false
  private emoticonsSetId = 0
  private emoticonsMap: EmoticonsMap = {}
  private previewProviders: Record<string, PreviewProvider>

  /**
   * Creates a new instance of the class.
   * @class
   */
  private constructor() {
    this.previewProviders = {
      [PreviewGithub.getProviderId()]: PreviewGithub,
      [PreviewStrawPoll.getProviderId()]: PreviewStrawPoll,
      [PreviewTwitch.getProviderId()]: PreviewTwitch,
      [PreviewYoutube.getProviderId()]: PreviewYoutube,
    }
  }

  /**
   * Sets the badges.
   * @param badges - The badges.
   */
  public setBadges(badges: RawBadges) {
    this.badges = badges
  }

  /**
   * Gets the badges.
   * @return The badges.
   */
  public getBadges() {
    return this.badges
  }

  /**
   * Sets the cheermotes.
   * @param cheermotes - The cheermotes.
   */
  public setCheermotes(cheermotes: RawCheermote[]) {
    this.cheermotes = cheermotes
  }

  /**
   * Sets the emoticons set id.
   * @param id - The emoticons set id.
   */
  public setEmoticonsSetId(id: number) {
    const emoticonsSetId = _.get(Emoticons, id)

    this.emoticonsSetId = !_.isNil(emoticonsSetId) ? id : 0

    this.emoticonsMap = _.reduce(
      TwitchRegExpEmotesMap,
      (map, name, regex) => {
        map[regex] = { name, id: Emoticons[this.emoticonsSetId][regex].toString() }

        return map
      },
      {} as EmoticonsMap
    )
  }

  /**
   * Returns the emoticons map.
   * @return The emoticons map.
   */
  public getEmoticonsMap() {
    return this.emoticonsMap
  }

  /**
   * Gets the cheermotes.
   * @return The cheermotes.
   */
  public getCheermotes() {
    return this.cheermotes
  }

  /**
   * Sets the highlights, highlights ignored users and highlights permanent users.
   * @param highlights - The highlights.
   * @param ignoredUsers - The highlights ignored users.
   * @param permanentUsers - The highlights permanent users.
   */
  public setHighlights(highlights: SerializedHighlights, ignoredUsers: string[], permanentUsers: string[]) {
    this.highlights = highlights
    this.highlightsIgnoredUsers = ignoredUsers
    this.highlightsPermanentUsers = permanentUsers
  }

  /**
   * Defines if we should highlight all mentions or not.
   * @param highlightAllMentions - `true` to highlight all mentions.
   */
  public setHighlightAllMentions(highlightAllMentions: boolean) {
    this.highlightAllMentions = highlightAllMentions
  }

  /**
   * Gets the highlights.
   * @return The highlights.
   */
  public getHighlights() {
    return this.highlights
  }

  /**
   * Adds an emotes provider.
   * @param provider - The provider.
   */
  public addEmotesProvider(provider: EmotesProvider<Emote>) {
    this.emotesProviders.set(provider.prefix, provider)
  }

  /**
   * Gets all emotes provider.
   * @return The emotes providers.
   */
  public getEmotesProviders() {
    return this.emotesProviders
  }

  /**
   * Gets a specific emotes provider.
   * @param prefix - The provider prefix.
   * @return The emotes provider.
   */
  public getEmotesProvider(prefix: EmoteProviderPrefix) {
    return this.emotesProviders.get(prefix)
  }

  /**
   * Adds known bots.
   * @param bots - The bots.
   */
  public addBots(bots: string[]) {
    for (const bot of bots) {
      this.bots.add(bot)
    }
  }

  /**
   * Check if highlights from a specific user should be ignored.
   * @param  username - The username.
   * @return `true` when ignored.
   */
  public shouldIgnoreHighlights(username: string) {
    return _.includes(this.highlightsIgnoredUsers, username)
  }

  /**
   * Check if a message should always be highlighted.
   * @param  username - The username.
   * @return `true` when highlighted.
   */
  public shouldAlwaysHighlight(username: string) {
    return _.includes(this.highlightsPermanentUsers, username)
  }

  /**
   * Checks if all mentions should be highlighted or not.
   * @return `true` when highlighting all mentions.
   */
  public shouldHighlightAllMentions() {
    return this.highlightAllMentions
  }

  /**
   * Defines if a user is a known bot.
   * @param  username - The username.
   * @return `true` if the user is a known bot.
   */
  public isBot(username: string) {
    return this.bots.has(username)
  }

  /**
   * Returns all the available preview providers.
   * @return The providers keyed by provider id.
   */
  public getPreviewProviders() {
    return this.previewProviders
  }
}

/**
 * Emoticons map.
 */
type EmoticonsMap = Record<string, { name: string; id: string }>
