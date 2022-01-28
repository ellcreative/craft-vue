<template>
  <div class="map">
    <div class="map__headline">
      <span class="teal">H-</span>TOWN <br />
      <span class="purple">USA</span>
    </div>
    <div class="map__wrapper">
      <client-only>
        <GmapMap
          ref="gmap"
          :zoom="zoom"
          :center="center"
          :options="{
            disableDefaultUI: true,
            zoomControl: false,
            mapId: mapId,
          }"
        >
          <GmapMarker
            v-for="(marker, m) in markers"
            :key="m"
            :position="marker.position"
            icon="/map-markers/marker.svg"
            :clickable="false"
            :draggable="false"
          />
        </GmapMap>
      </client-only>
      <div class="map-card">
        <div class="map-card__wrapper">
          <h6>Address</h6>
          <p>{{ block.address }}</p>
          <h6>Phone</h6>
          <p>{{ block.phoneNumber }}</p>
          <h6>Jon Inquiries</h6>
          <a :href="`mailto:${block.email}`">{{ block.email }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Map',
  props: {
    block: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      center: { lat: 29.80622, lng: -95.41844 },
      zoom: 14,
      markers: [
        {
          position: {
            lat: 29.80622,
            lng: -95.41844,
          },
        },
      ],
    }
  },
  computed: {
    mapId() {
      return this.$store.state.globals.sets.map.styles
    },
  },
}
</script>

<style lang="scss">
.vue-map-container {
  height: 700px;
  margin: 0 auto;
}
</style>
