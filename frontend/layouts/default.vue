<template>
  <div>
    <template>
      <Navigation handle="main" :class="{ active: $store.state.isMenuOpen }" />
    </template>
    <div class="main-content" :class="{ active: $store.state.isMenuOpen }">
      <nuxt />
    </div>
    <template v-if="!$store.state.isTransitioning">
      <transition name="fade" mode="out-in">
        <!--        <Footer />-->
      </transition>
    </template>
    <client-only>
      <!--      <CookieControl v-if="$store.state.globals.sets.gdpr">-->
      <!--        <template v-slot:bar>-->
      <!--          <div class="cookieControl__BarTitle">{{ $store.state.globals.sets.gdpr.cookieHeadline }}</div>-->
      <!--          <div v-html="$store.state.globals.sets.gdpr.cookieCopy"></div>-->
      <!--        </template>-->
      <!--      </CookieControl>-->
    </client-only>
  </div>
</template>

<script>
import Navigation from '~/components/Navigation'

export default {
  middleware: 'load',
  components: {
    Navigation,
  },
  data() {
    return {
      page: {},
      headData: {
        bodyAttrs: {
          class: '',
        },
      },
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading
    },
    is404() {
      return this.$store.state.is404
    },
  },
  watch: {
    isLoading() {
      if (process.browser) {
        if (this.isLoading) {
          // console.log('this.$nuxt.$loading.start()')
          this.$nuxt.$loading.start()
        } else {
          // console.log('this.$nuxt.$loading.finish()')
          this.$nuxt.$loading.finish()
        }
      }
    },
    is404() {
      this.check404()
    },
  },
  created() {
    this.$nuxt.$on('set-body-class', this.setBodyClass)
  },
  beforeDestroy() {
    this.$nuxt.$off('set-body-class', this.setBodyClass)
  },
  mounted() {
    this.check404()
  },
  methods: {
    check404() {
      if (this.is404) {
        this.$store.commit('set404State', false)
        this.$nuxt.error({ statusCode: 404, message: 'Page not found' })
      }
    },
    setBodyClass(classString) {
      this.headData = {
        ...this.headData,
        bodyAttrs: {
          ...this.headData.bodyAttrs,
          class: classString,
        },
      }
    },
  },
  head() {
    return this.headData
  },
}
</script>

<style lang="scss">
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.cookieControl {
  &__BarContainer {
    border-top: 1px solid #d0d0d0;
  }

  &__BarTitle {
    color: #fff;
  }
}
</style>
