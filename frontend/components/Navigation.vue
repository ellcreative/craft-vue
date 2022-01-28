<template>
  <ul class="navigation">
    <li><nuxt-link to="/">Home</nuxt-link></li>
    <li><nuxt-link to="/pose">Pose</nuxt-link></li>
    <li><nuxt-link to="/articles">Articles</nuxt-link></li>
    <li v-for="page in pages" :key="page.uri">
      <nuxt-link :to="'/' + page.uri">{{ page.title }}</nuxt-link>
      <ul class="navigation__sub" v-if="page.children.length">
        <li v-for="subPage in page.children" :key="subPage.uri">
          <nuxt-link :to="'/' + subPage.uri">{{ subPage.title }}</nuxt-link>
          <ul class="navigation__sub-2" v-if="page.children.length">
            <li v-for="subPage in page.children" :key="subPage.uri">
              <nuxt-link :to="'/' + subPage.uri">{{ subPage.title }}</nuxt-link>
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    pages: {
      type: Array,
      default() {
        return []
      },
    },
  },
}
</script>

<style lang="scss" scoped>
ul {
  padding: 0;
}
.navigation {
  display: flex;
  li {
    display: inline-block;
    a {
      text-decoration: none;
    }
  }
  > li {
    &:not(:first-child) {
      margin-left: 12px;
    }
    &:not(:last-child) {
      margin-right: 12px;
    }
  }
  &__sub,
  &__sub-2 {
    display: none;
  }
}
</style>
<!--<template>-->
<!--  <div class="navigation" :class="'navigation&#45;&#45;' + $paramCase(handle)">-->
<!--    <template v-if="$paramCase(handle) === 'main'">-->
<!--      <svg-icon class="navigation__triangle" name="triangle" />-->
<!--    </template>-->
<!--    <slot />-->
<!--    <div class="navigation__contents">-->
<!--      <ul>-->
<!--        <template v-for="navItem in navigation">-->
<!--          <NavItem :key="navItem.id" :nav-item="navItem" />-->
<!--        </template>-->
<!--      </ul>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import NavItem from './elements/NavItem'-->
<!--import { gqlNavigation } from '~/gql/navigations.graphql'-->

<!--export default {-->
<!--  name: 'Navigation',-->
<!--  components: {-->
<!--    NavItem,-->
<!--  },-->
<!--  props: {-->
<!--    handle: {-->
<!--      type: String,-->
<!--      default: '',-->
<!--    },-->
<!--  },-->
<!--  serverCacheKey(props) {-->
<!--    return `navigation::${props.handle}`-->
<!--  },-->
<!--  async fetch() {-->
<!--    this.$timeStart(`graphql Nav ${this.handle}`)-->
<!--    const client = this.$apolloProvider.defaultClient-->
<!--    const { data } = await client.query({-->
<!--      query: gqlNavigation,-->
<!--      variables: { ...client.defaultOptions.$query.variables, handle: this.handle },-->
<!--    })-->
<!--    this.$timeEnd(`graphql Nav ${this.handle}`, `[GQL] Nav Query ${this.handle}`)-->

<!--    // set the page data-->
<!--    this.navigation = data.navigation-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      navigation: [],-->
<!--    }-->
<!--  },-->
<!--}-->
<!--</script>-->
