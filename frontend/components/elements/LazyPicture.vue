<template>
  <div ref="picture" v-observe-visibility="visibilityChanged" class="picture" @click="openModal">
    <picture v-if="true || placeholder" class="picture__placeholder" :class="{ hide: loaded }">
      <img :src="placeholder" :alt="alt" loading="lazy" decoding="async" />
    </picture>
    <picture>
      <source
        v-show="inView || forceInView"
        v-if="srcWebp || srcsetWebp"
        :srcWebp="srcWebp"
        :srcset="srcsetWebp"
        :sizes="sizes"
        type="image/webp"
      />
      <source v-if="srcset" v-show="inView || forceInView" :srcset="srcset" :type="srcType" :sizes="sizes" />
      <img
        :class="{ blur: !disableBlur && !inView && !forceInView }"
        :width="loaded ? null : placeholderWidth"
        :height="loaded ? null : placeholderHeight"
        :src="lowres"
        :alt="alt"
        loading="lazy"
        decoding="async"
        @load="imageLoaded"
      />
    </picture>
    <div v-if="iconName" class="picture__icon"><svg-icon :name="iconName" /></div>
    <p v-if="caption" class="picture__caption">{{ caption }}</p>
    <div v-if="headline || copy" class="picture__hover" v-html="hoverCopy" />
  </div>
</template>

<script>
export default {
  name: 'LazyPicture',
  props: {
    iconName: {
      type: String,
      default: '',
    },
    disableBlur: {
      type: Boolean,
      default: true,
    },
    srcWebp: {
      type: String,
      default: '',
    },
    srcsetWebp: {
      type: String,
      default: '',
    },
    src: {
      type: String,
      default: '',
    },
    srcset: {
      type: String,
      default: '',
    },
    srcType: {
      type: String,
      default: '',
    },
    sizes: {
      type: String,
      default: '100vw',
    },
    placeholder: {
      type: String,
      default: '',
    },
    placeholderWidth: {
      type: [String, Number],
      default: 'auto',
    },
    placeholderHeight: {
      type: [String, Number],
      default: 'auto',
    },
    alt: {
      type: String,
      default: '',
    },
    caption: {
      type: String,
      default: '',
    },
    modal: {
      type: Boolean,
      default: false,
    },
    forceInView: {
      type: Boolean,
      default: false,
    },
    headline: {
      type: String,
      default: '',
    },
    copy: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      inView: false,
      loaded: false,
    }
  },
  computed: {
    lowres() {
      if (this.inView) {
        return this.src
      }
      return this.placeholder || this.src
    },
    hoverCopy() {
      if (this.headline && this.copy) {
        return `<h1>${this.headline}</h1>${this.copy}`
      }
      if (this.headline) {
        return `<h1>${this.headline}</h1>`
      }
      if (this.copy) {
        return this.copy
      }
      return ''
    },
  },
  mounted() {
    if (process.browser && window.MSInputMethodContext && document.documentMode) {
      this.inView = true
    }
  },
  methods: {
    visibilityChanged(isVisible) {
      if (isVisible) this.inView = true
    },
    imageLoaded() {
      this.loaded = true
    },
    openModal(e) {
      if (this.modal) {
        this.$nuxt.$emit('open-modal', this.$refs.picture.outerHTML.replace(/sizes=".*?"/, 'sizes="95vw"'))
      }
    },
  },
}
</script>

<style scoped lang="scss">
img {
  width: 100%;
  transition: 500ms;
}

.blur {
  filter: blur(8px);
}

/* Safari 9+ */
@supports (-webkit-marquee-repetition: infinite) and (object-fit: fill) {
  .blur {
    filter: none;
  }
}
/* Safari 10.1+ */
@media not all and (min-resolution: 0.001dpcm) {
  @supports (-webkit-appearance: none) {
    .blur {
      filter: none;
    }
  }
}
</style>

<style lang="scss">
.picture {
  position: relative;

  &--left {
    margin-right: auto;
  }

  &--center {
    margin-right: auto;
    margin-left: auto;
  }

  &--right {
    margin-left: auto;
  }

  &__placeholder {
    transition: 500ms;
    position: absolute !important;
    inset: 0;
    z-index: 2;
    opacity: 1;
    visibility: visible;
    overflow: hidden;

    img {
      filter: blur(8px);
      transform: scale(1.05);
      margin: auto;
      height: 100%;
    }

    &.hide {
      opacity: 0;
      visibility: hidden;
    }
  }
}
</style>
