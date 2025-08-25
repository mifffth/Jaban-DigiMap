import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../styles/map-view.css";

import { loadMapLayers } from "../utils/layers.js";
import { addLocationControl, addLegend } from "../utils/controls.js";
import { createColoredIcon } from "../utils/icons.js";
import { saveMapView, restoreMapView } from "../utils/utils.js";

export class MapView {
  constructor(container) {
    this.container = container;
    this.map = null;
    this.userMarker = null;
  }

  render() {
    this.container.innerHTML = `<div id="map-container"></div>`;
    this.initMap();
  }

  async initMap() {
    const center = restoreMapView() || [-7.711361976168338, 110.3525845328189];
    this.map = L.map("map-container").setView(center, 15);

    const baseLayers = {
      "Open Street Map": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }),
      "Open Topo Map": L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        attribution: "Map data: © OpenTopoMap contributors",
      }),
      "Esri World Imagery": L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Tiles © Esri" }
      ),
    };

    baseLayers["Open Street Map"].addTo(this.map);

    await loadMapLayers(this.map, baseLayers, createColoredIcon);
    addLocationControl(this.map, (latlng) => this.setUserLocation(latlng));
    addLegend(this.map);

    this.map.on("moveend", () => saveMapView(this.map));
  }

  setUserLocation(latlng) {
    if (this.userMarker) this.map.removeLayer(this.userMarker);

    const userIcon = L.divIcon({
      html: '<div class="user-marker-pulse"></div>',
      className: "user-marker-container",
      iconSize: [20, 20],
    });

    this.userMarker = L.marker(latlng, { icon: userIcon }).addTo(this.map);
    this.map.setView(latlng, 13);
  }
}
