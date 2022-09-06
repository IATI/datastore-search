<template>
  <div style="display: inline">
    <div id="mapContainer" style="height: 100%"></div>
    <div class="leaflet-bottom leaflet-right">
      <button
        class="leaflet-control leaflet-bar px-4 py-2 text-white bg-iati-grey hover:bg-iati-blue rounded flex justify-between"
        @click="global.updateMap(map, tile)"
      >
        Query current view
      </button>
    </div>
  </div>
</template>

<script>
import { toRaw } from "vue";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import L from "leaflet";

export default {
  name: "MapView",
  inject: ["global"],
  data() {
    return {
      map: null,
      tile: null,
    };
  },
  mounted() {
    this.map = L.map("mapContainer").setView([46.05, 11.05], 5);
    this.tile = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      minZoom: 3,
      maxZoom: 19,
      attribution: "© OpenStreetMap",
      noWrap: true,
    });
    this.map.addLayer(toRaw(this.tile));
  },
  onBeforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  },
};
</script>
