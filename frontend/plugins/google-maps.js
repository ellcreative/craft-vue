import Vue from 'vue'
import GmapCluster from 'gmap-vue/dist/components/cluster'
import HaversineGeolocation from 'haversine-geolocation'
import * as VueGoogleMaps from 'gmap-vue'

export default ({ app }, inject) => {
  inject('haversine', HaversineGeolocation)
  Vue.use(VueGoogleMaps, {
    mapId: app.store.state.globals.sets.map.styles,
    load: {
      key: app.store.state.globals.sets.map.apiKey,
      map_ids: app.store.state.globals.sets.map.styles,
    },
    installComponents: true,
  })
  Vue.component('GmapCluster', GmapCluster)
}
