<template>
    <div class="h-[60vh] w-[80vh] p-2">
        <div id="map" style="width: 100%; height: 100%"></div>
    </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import global from '../global';

export default {
    name: 'SmallMap',
    inject: ['global'],
    data() {
        return {
            map: null,
        };
    },
    mounted() {
        const southWestCorner = L.latLng(-85, -180);
        const northEastCorner = L.latLng(85, 180);
        const bounds = L.latLngBounds(southWestCorner, northEastCorner);
        this.map = L.map('map', {
            zoomDelta: 0.25,
            zoomSnap: 0,
        }).setView(
            [global.state.bbox.centerLat, global.state.bbox.centerLon],
            global.state.bbox.zoom,
        );
        this.map.setMaxBounds(bounds);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom: 3,
            maxZoom: 19,
            attribution: '© OpenStreetMap',
            noWrap: true,
        }).addTo(this.map);
        global.setMapBbox(this.map);
        this.map.on('moveend', () => {
            global.setMapBbox(this.map);
        });
    },
    onBeforeUnmount() {
        if (this.map) {
            this.map.remove();
        }
    },
};
</script>
