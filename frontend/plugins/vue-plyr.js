import Vue from 'vue'
import VuePlyr from 'vue-plyr/dist/vue-plyr.ssr.js'

// The second argument is optional and sets the default config values for every player.
Vue.use(VuePlyr, {
  plyr: {},
})

export default {
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/vue-plyr/dist/vue-plyr.css',
        },
      ],
    }
  },
}
