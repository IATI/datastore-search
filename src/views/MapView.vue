<template>
  <div class="inline">
    <div id="mapContainer" class="h-[90%]"></div>
    <div id="mapUI" class="h-[10%] grid grid-cols-4 gap-2 text-left border">
      <p v-if="searchInProgress" class="col-span-2">Searching...</p>
      <p v-if="(numFound == 0) & !searchInProgress" class="col-span-2">
        Found no activities with locations in the current map view. Try a wider
        zoom level or a different location.
      </p>
      <p
        v-if="(numFound <= 1000) & (numFound > 0) & !searchInProgress"
        class="col-span-2"
      >
        Found {{ numFound }} activities with {{ pointCount }} locations in the
        current map view.
      </p>
      <p v-if="(numFound > 1000) & !searchInProgress" class="col-span-2">
        Found {{ numFound }} activities in the current map view. Displaying
        {{ pointCount }} locations from the first 1000 activities. Try a closer
        zoom level to narrow your search.
      </p>
      <button
        class="col-span-2 bg-iati-grey hover:bg-iati-blue text-white font-bold py-1 px-2 rounded ml-4 w-3/24 block inline mb-1"
        @click="
          searchInProgress = true;
          global.updateMap(map, tile).then((returnValues) => {
            numFound = returnValues[0];
            pointCount = returnValues[1];
            searchInProgress = false;
          });
        "
      >
        Update map
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
import global from "../global";

export default {
  name: "MapView",
  inject: ["global"],
  data() {
    return {
      map: null,
      tile: null,
      numFound: 0,
      pointCount: 0,
      searchInProgress: true,
    };
  },
  mounted() {
    const latMin = -30;
    const latMax = 30;
    const lonMinA = -15;
    const lonMaxA = 40;
    const lonMinB = 15;
    const lonMaxB = 30;
    const startLat = Math.random() * (latMax - latMin) + latMin;
    let startLon = 0;
    if (startLat > 6) {
      startLon = Math.random() * (lonMaxA - lonMinA) + lonMinA;
    } else {
      startLon = Math.random() * (lonMaxB - lonMinB) + lonMinB;
    }
    this.map = L.map("mapContainer").setView([startLat, startLon], 10);
    this.tile = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      minZoom: 3,
      maxZoom: 19,
      attribution: "© OpenStreetMap",
      noWrap: true,
    });
    this.map.addLayer(toRaw(this.tile));
    global.updateMap(this.map, this.tile).then((returnValues) => {
      this.numFound = returnValues[0];
      this.pointCount = returnValues[1];
      this.searchInProgress = false;
    });
  },
  onBeforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  },
};
</script>
