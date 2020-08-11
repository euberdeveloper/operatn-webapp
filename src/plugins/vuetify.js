import Vue from 'vue'
import Vuetify from 'vuetify'
import colors from 'vuetify/lib/util/colors'
import 'vuetify/dist/vuetify.min.css'
import it from 'vuetify/lib/locale/it'

Vue.use(Vuetify)

const opts = {
  theme: {
    themes: {
      dark: {
        primary: colors.yellow.darken4,
        accent: colors.yellow.darken3,
      },
    },
  },
  lang: {
    locales: { it },
    current: 'it',
  },
}

export default new Vuetify(opts)