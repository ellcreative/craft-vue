<template>
  <div>
    <slot />
    <div v-for="(block, b) in displayBlocks" :id="block.anchor" :key="block.id" :class="blockClass(block)">
      <!-- BLOCK -->
      <template v-if="block.typeHandle === 'block'">
        <PageBuilder
          :blocks="block.children"
          class="block__wrapper"
          :related-list-title="relatedListTitle"
          :related-list-items="relatedListItems"
          :context="context"
        >
          <div v-if="block.bgText" class="block__bgText">{{ block.bgText }}</div>
          <div v-if="block.headline" class="block__headline" v-html="block.headline"></div>
        </PageBuilder>
      </template>
      <!-- TWO COLUMN -->
      <template v-else-if="block.typeHandle === 'twoColumn'">
        <PageBuilder
          :blocks="block.children"
          class="two-column__wrapper"
          :related-list-title="relatedListTitle"
          :related-list-items="relatedListItems"
          :context="block.columnLayout"
        />
      </template>
      <!-- THREE COLUMN -->
      <template v-else-if="block.typeHandle === 'threeColumn'">
        <PageBuilder
          :blocks="block.children"
          class="three-column__wrapper"
          :related-list-title="relatedListTitle"
          :related-list-items="relatedListItems"
          context="333333"
        />
      </template>
      <!-- COLUMN -->
      <template v-else-if="block.typeHandle === 'column'">
        <PageBuilder
          :blocks="block.children"
          class="column__wrapper"
          :related-list-title="relatedListTitle"
          :related-list-items="relatedListItems"
          :context="context"
          :column="b"
        />
      </template>
      <!-- COPY -->
      <template v-else-if="block.typeHandle === 'copy'">
        <div v-html="block.copy" />
      </template>
      <!-- IMAGE -->
      <template v-else-if="block.typeHandle === 'image'">
        <template v-for="image of block.image">
          <LazyPicture
            :key="image.id"
            v-bind="$pictureProps(image, getColumnOI(context, column))"
            :headline="block.headline"
            :copy="block.copy"
          />
        </template>
      </template>
      <!-- FORM -->
      <template v-else-if="block.typeHandle === 'form'">
        <Form v-if="block.form" :form-handle="block.form.handle" />
      </template>
      <!-- HR -->
      <template v-else-if="block.typeHandle === 'hr'">
        <hr />
      </template>
      <!-- MAP -->
      <template v-else-if="block.typeHandle === 'map'">
        <Map :block="block" />
      </template>
      <!-- VIDEO -->
      <template v-else-if="block.typeHandle === 'video'">
        <template v-for="video in block.video">
          <div v-if="video.extension === 'json'" :key="video.id" class="responsive-embed" v-html="video.embedCode" />
          <div v-else :key="video.id">
            <video
              :controls="block.showControls"
              :autoplay="block.autoplay"
              :muted="block.muted"
              :src="block.video[0].url"
            />
          </div>
        </template>
      </template>
      <!-- WIDGETS WIDGETS WIDGETS -->
      <!-- else MISSING -->
      <template v-else>
        <div class="error-block">
          <h1>Missing: {{ block.typeHandle || block.__typename }}</h1>
          <pre>{{ block }}</pre>
        </div>
      </template>
    </div>
    <slot name="after-children" />
  </div>
</template>

<script>
import Form from './elements/Form'
import LazyPicture from './elements/LazyPicture'
import Map from './elements/Map'

export default {
  name: 'PageBuilder',
  components: {
    Form,
    LazyPicture,
    Map,
  },
  props: {
    blocks: {
      type: Array,
      default() {
        return []
      },
    },
    relatedListTitle: {
      type: String,
      default: '',
    },
    relatedListItems: {
      type: Array,
      default() {
        return []
      },
    },
    context: {
      type: String,
      default: '',
    },
    column: {
      type: Number,
      default: 0,
    },
    cacheKey: {
      type: String,
      default: '',
    },
  },
  serverCacheKey(props) {
    if (!props.cacheKey) {
      return false
    }
    return `page-builder::${props.cacheKey}`
  },
  async fetch() {
    await this.getBlockEmbeds()
  },
  computed: {
    displayBlocks() {
      const blocks = [...this.blocks]
      let lastBlock = {}
      for (const [index, block] of Object.entries(blocks)) {
        // Handle any updates to the block if the last block type is the same as the current block type
        if (lastBlock.typeHandle === block.typeHandle) {
          if (block.typeHandle === 'twoColumn' && block.columnOrder === 'auto') {
            // Flip flop every twoColumn block if set to auto.
            blocks[index].columnOrder = lastBlock.columnOrder === 'left' ? 'right' : 'left'
          }
        } else if (block.typeHandle === 'twoColumn' && block.columnOrder === 'auto') {
          // Default to left if first twoColumn block.
          blocks[index].columnOrder = 'left'
        }
        lastBlock = block
      }
      return blocks
    },
  },
  watch: {
    blocks() {
      this.getBlockEmbeds()
    },
  },
  methods: {
    blockClass(block) {
      const typeHandle = block.typeHandle || block.__typename
      return `${this.$paramCase(typeHandle)}${block.lightDark ? ` ${this.$paramCase(typeHandle || '')}--dark` : ''}${
        block.gutterWidth ? ` ${this.$paramCase(typeHandle || '')}--gutter-${block.gutterWidth}` : ''
      }${block.blockWidth ? ` ${this.$paramCase(typeHandle || '')}--${block.blockWidth}` : ''}${
        block.columnOrder ? ` ${this.$paramCase(typeHandle || '')}--${block.columnOrder}` : ''
      }${block.columnLayout ? ` ${this.$paramCase(typeHandle || '')}--${block.columnLayout}` : ''}`
    },
    getColumnOI(context, column) {
      try {
        const oiSizes = context.match(/\d{2}/g).map(Number)
        return `oi${oiSizes[column % oiSizes.length]}`
      } catch (e) {
        return 'oiFullWidth'
      }
    },
    async getBlockEmbeds() {
      for (const b of Object.keys(this.blocks)) {
        const block = this.blocks[b]
        let blockUpdated = false
        if (block.typeHandle === 'video') {
          for (const i of Object.keys(block.video)) {
            if (block.video[i].extension === 'json' && !block.video[i].embedCode) {
              const data = await this.$getEmbedJsonData(block.video[i].url)
              block.video[i].embedCode = data.code
              blockUpdated = true
            }
          }
          if (blockUpdated) {
            this.$set(this.blocks, b, block)
          }
        }
      }
    },
  },
}
</script>
