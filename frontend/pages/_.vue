<template>
  <div>
    <template v-if="page">
      <pre>{{ page }}</pre>
      <template v-if="page.neoPageBuilder && page.neoPageBuilder.length">
        <NeoPageBuilder :blocks="page.neoPageBuilder" :cache-key="`${page.id}::${page.dateUpdated}`" />
      </template>
      <template v-if="page.vizyPageBuilder">
        akdlfjalkds
        <pre>{{ vizyPageBuilder }}</pre>
      </template>
    </template>
  </div>
</template>

<script>
import { gqlPage } from '~/gql/entries.graphql'
import NeoPageBuilder from '~/components/NeoPageBuilder'

export default {
  loading: false,
  components: {
    NeoPageBuilder,
  },
  async fetch() {
    // get the uri from the context
    let uri = this.$route.params.pathMatch
    if (!uri) {
      uri = '__home__'
    }

    this.$timeStart('graphql Page')
    const client = this.$apolloProvider.defaultClient
    const { data } = await client.query({
      query: gqlPage,
      variables: { ...client.defaultOptions.$query.variables, uri },
    })
    this.$timeEnd('graphql Page', '[GQL] Page Query')

    // throw a 404 if appropriate (https://nuxtjs.org/blog/understanding-how-fetch-works-in-nuxt-2-12#error-handling)
    if (!data?.page) {
      this.$store.commit('setLoadingState', false)
      if (!(await this.$checkRedirect(this, `/${uri}`))) {
        this.$store.commit('set404State', true)
      }
      return
    }

    // set the page data
    if (data.page?.seomatic) {
      this.headData = {
        ...this.$processSeomaticData(data.page.seomatic),
        bodyAttrs: {
          class: `page page--${this.$paramCase(data.page.typeHandle)} ${uri === '__home__' ? 'page--homepage' : ''}`,
        },
      }
    }
    this.page = data.page

    if (uri !== '__home__') {
      const breadcrumbs = [{ title: this.page.title, url: this.$stripDomain(this.page.url) }]
      if (this.page.parent) {
        if (this.page.typeHandle === 'service') {
          breadcrumbs.unshift({ title: 'Services', url: '/services' })
        } else {
          breadcrumbs.unshift({ title: this.page.parent.title, url: this.$stripDomain(this.page.parent.url) })
        }
      }
      this.$store.commit('setBreadcrumbs', breadcrumbs)
    }

    this.$store.commit('setLoadingState', false)
  },
  data() {
    return {
      page: {},
      headData: {},
    }
  },
  head() {
    return this.headData
  },
}
</script>

<style lang="scss">
.images {
  width: 800px;
  display: flex;
}
</style>
