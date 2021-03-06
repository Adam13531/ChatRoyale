import { Colors } from '@blueprintjs/core'

import Theme from 'constants/theme'

/**
 * Base theme.
 */
export default {
  background: {
    [Theme.Dark]: '#293741',
    [Theme.Light]: Colors.LIGHT_GRAY5,
  },
  beta: {
    height: 200,
    width: 500,
  },
  changelog: {
    background: 'rgba(255, 255, 255, 0.7)',
    dark: 'rgba(16, 22, 26, 0.3)',
    shadow: 'rgba(16, 22, 26, 0.4)',
  },
  channel: {
    thumbnail: {
      height: 158,
      width: 280,
    },
  },
  chatter: {
    avatar: {
      margin: '7px 10px 7px 0',
      size: 40,
    },
  },
  chatters: [
    Colors.BLUE4,
    Colors.BLUE5,
    Colors.GREEN3,
    Colors.GREEN5,
    Colors.ORANGE3,
    Colors.ORANGE5,
    Colors.RED4,
    Colors.RED5,
    Colors.VERMILION4,
    Colors.ROSE4,
    Colors.VIOLET5,
    Colors.INDIGO5,
    Colors.COBALT4,
    Colors.COBALT5,
    Colors.TURQUOISE4,
    Colors.FOREST3,
    Colors.FOREST5,
    Colors.LIME3,
    Colors.LIME4,
    Colors.GOLD4,
    Colors.SEPIA5,
  ],
  chattersList: {
    height: 24,
    typeColor: Colors.GRAY3,
  },
  emotePicker: {
    cellGutter: 0,
    cellSize: 38,
    height: 300,
    maxSize: 28,
    padding: 10,
    width: 344,
  },
  external: {
    thumbnail: {
      height: 45,
      width: 80,
    },
  },
  follow: {
    background: 'rgba(219, 55, 55, 0.05)',
    border: 'rgba(219, 55, 55, 0.4)',
  },
  help: {
    minHeight: 57,
  },
  history: {
    height: 200,
  },
  log: {
    border: {
      bottom: 2,
      top: 3,
    },
    hPadding: 10,
    highlight: {
      Blue: { color: Colors.WHITE, background: Colors.BLUE3 },
      Green: { color: Colors.WHITE, background: Colors.GREEN3 },
      Red: { color: Colors.WHITE, background: Colors.RED3 },
      Yellow: { color: Colors.DARK_GRAY1, background: Colors.GOLD5 },
    },
    minHeight: 33,
    pause: 'rgba(245, 86, 86, 0.78)',
  },
  login: {
    feature: {
      height: 60,
      width: 280,
    },
    features: {
      height: 500,
    },
  },
  logo: '#c2ccd6',
  message: {
    time: {
      color: Colors.GRAY2,
    },
  },
  notice: {
    color: Colors.GRAY2,
  },
  rejectedMessage: {
    button: {
      icon: 18,
      size: 24,
    },
  },
  player: {
    height: 282,
    width: 500,
  },
  previews: {
    thumbnail: {
      height: 46,
      width: 80,
    },
  },
  settings: {
    height: 550,
  },
  streams: {
    flip: 150,
    height: 78,
    margin: 14,
    width: 350,
    thumbnail_width: 120,
  },
  tooltip: {
    background: Colors.DARK_GRAY1,
  },
  twitch: {
    purple: '#9146FF',
    lightPurple: 'rgba(145, 70, 255, 0.15)',
  },
  twitchState: {
    gap: 6,
    size: 12,
  },
}

/**
 * Twitch username colors default mapping.
 */
export const TwitchUserColorMap = {
  '#0000FF': '#6e88ef',
  '#008000': '#23a723',
  '#00FF7F': '#0ede76',
  '#1E90FF': '#47a4ff',
  '#8A2BE2': '#b86cff',
  '#9ACD32': '#97c140',
  '#B22222': '#e64545',
  '#FF0000': '#ff3d3d',
  '#FF4500': '#ff6025',
}
