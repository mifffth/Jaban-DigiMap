import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../styles/map-view.css";

export class MapView {
  constructor(container) {
    this.container = container;
    this.presenter = null;
    this.map = null;
    this.userMarker = null;
  }

  setPresenter(presenter) {
    this.presenter = presenter;
  }

  render() {
    this.container.innerHTML = `
      <div id="map-container"></div>
    `;
    this.initMap();
  }

  async initMap() {
    const savedView = sessionStorage.getItem("mapView");
    if (savedView) {
      const { center } = JSON.parse(savedView);
      this.map = L.map("map-container").setView(center, 15);
    } else {
      this.map = L.map("map-container").setView(
        [-7.721768493563009, 110.35871835788771],
        18
      );
    }

    const baseLayers = {
      "Open Street Map": L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "© OpenStreetMap",
        }
      ),
      "Open Topo Map": L.tileLayer(
        "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        {
          attribution: "Map data: © OpenTopoMap contributors",
        }
      ),
      "Esri World Imagery": L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution:
            "Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
        }
      ),
    };

    baseLayers["Open Street Map"].addTo(this.map);

    L.Marker.prototype.options.icon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    this.loadMapLayers(baseLayers);
    this.addLocationControl();

    this.map.on("moveend", () => {
      const center = this.map.getCenter();
      const zoom = this.map.getZoom();
      sessionStorage.setItem(
        "mapView",
        JSON.stringify({
          center: [center.lat, center.lng],
          zoom: zoom,
        })
      );
    });
  }

  async loadMapLayers(baseLayers) {
    const layersControl = L.control
      .layers(
        baseLayers,
        {},
        {
          position: "topright",
          collapsed: true,
        }
      )
      .addTo(this.map);

    const rtColorPalette = {
      1: "#f7c8f9",
      2: "#fdc5c5",
      3: "#c5f3fd",
      4: "#c5fdc5",
      5: "#d8c5fd",
      6: "#fdeac5",
    };

    const padukuhanPromise = fetch("./data/Jaban.geojson").then((res) =>
      res.json()
    );
    const rtPromise = fetch("./data/RT_Jaban.geojson").then((res) =>
      res.json()
    );
    const rtrwPromise = fetch("./data/RTRW_Jaban_Pt.geojson").then((res) =>
      res.json()
    );

    Promise.all([padukuhanPromise, rtPromise, rtrwPromise])
      .then(([padukuhanData, rtData, rtrwData]) => {
        const padukuhanLayer = L.geoJSON(padukuhanData, {
          style: () => ({
            color: "#00cccc",
            weight: 3,
            opacity: 1,
            fillOpacity: 0.5,
          }),
          onEachFeature: (feature, layer) => {
            if (feature.properties) {
              layer.bindPopup("Padukuhan " + feature.properties.Padukuhan);
            }
          },
        });
        padukuhanLayer.addTo(this.map);

        const rtLayer = L.geoJSON(rtData, {
          style: (feature) => {
            const rtId = feature.properties.RT;
            const color = rtColorPalette[rtId] || "#cccccc";
            return {
              color: color,
              weight: 2,
              opacity: 1,
              fillColor: color,
              fillOpacity: 0.7,
            };
          },
          onEachFeature: (feature, layer) => {
            if (feature.properties && feature.properties.RT) {
              layer.bindPopup(`<b>RT ${feature.properties.RT}</b>`);
            }
          },
        });
        rtLayer.addTo(this.map);

        const tipeColors = {
          RT: "#ff6600",
          RW: "#3366ff",
          "Ketua Dukuh": "#33cc33",
        };

        const rtrwLayer = L.geoJSON(rtrwData, {
          pointToLayer: (feature, latlng) => {
            const tipe = feature.properties?.Tipe || "RT";
            const color = tipeColors[tipe] || "#999999";
            return L.marker(latlng, { icon: this.createColoredIcon(color) });
          },
          onEachFeature: (feature, layer) => {
            if (feature.properties) {
              const tipe = feature.properties.RTRW || "N/A";
              const nama = feature.properties.Nama || "Tidak diketahui";
              const lat = feature.properties.Latitude;
              const lng = feature.properties.Longitude;
              let gmapsLink = "";

              if (lat && lng) {
                gmapsLink = `<br><a href="https://www.google.com/maps?q=${lat},${lng}" target="_blank">📍 Lihat di Google Maps</a>`;
              }

              layer.bindPopup(`
                <b>Tipe:</b> ${tipe}<br>
                <b>Nama:</b> ${nama}
                ${gmapsLink}
              `);
            }
          },
        });
        rtrwLayer.addTo(this.map);

        layersControl.addOverlay(rtrwLayer, "Ketua RT/RW");
        layersControl.addOverlay(rtLayer, "Batas RT/RW");

        const legend = L.control({ position: "bottomleft" });
        legend.onAdd = () => {
          const div = L.DomUtil.create("div", "info legend");
          div.style.background = "white";
          div.style.padding = "6px";
          div.style.borderRadius = "8px";
          div.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
          div.style.fontSize = "12px";
          div.innerHTML += `<b>Legenda</b><br>`;

          div.innerHTML += `<i style="background:#33cc33; width:12px; height:12px; display:inline-block; margin-right:4px;"></i>Ketua Padukuhan<br>`;
          div.innerHTML += `<i style="background:#ff6600; width:12px; height:12px; display:inline-block; margin-right:4px;"></i>Ketua RT<br>`;
          div.innerHTML += `<i style="background:#3366ff; width:12px; height:12px; display:inline-block; margin-right:4px;"></i>Ketua RW<br>`;

          return div;
        };
        legend.addTo(this.map);
      })
      .catch((error) => {
        console.error("Error loading GeoJSON data:", error);
        this.container.innerHTML += `<div class="error-message">Gagal memuat data peta.</div>`;
      });
  }

  addLocationControl() {
    const LocationControl = L.Control.extend({
      options: {
        position: "topleft",
      },
      onAdd: () => {
        const button = L.DomUtil.create("button", "leaflet-bar");
        button.innerHTML =
          '<i class="fa-solid fa-location-dot" style="font-size: 19px;"></i>';
        button.setAttribute("aria-label", "Temukan lokasi saya");
        button.style.backgroundColor = "white";
        button.style.color = "black";
        button.style.padding = "8px";
        button.style.borderRadius = "4px";
        button.style.boxShadow = "0 4px 12px rgba(68, 55, 55, 0.1)";
        button.style.cursor = "pointer";
        button.onclick = (e) => {
          e.stopPropagation();
          this.getUserLocation();
        };
        return button;
      },
    });
    this.map.addControl(new LocationControl());
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const latLng = [latitude, longitude];

          if (this.userMarker) {
            this.map.removeLayer(this.userMarker);
          }

          const userIcon = L.divIcon({
            html: '<div class="user-marker-pulse"></div>',
            className: "user-marker-container",
            iconSize: [20, 20],
          });

          this.userMarker = L.marker(latLng, { icon: userIcon }).addTo(
            this.map
          );
          this.map.setView(latLng, 13);

          const popupContainer = document.createElement("div");
          popupContainer.innerHTML = `
            <b>Lokasi Anda:</b><br>${latitude.toFixed(5)}, ${longitude.toFixed(
            5
          )}<br><br>
            <button class="delete-marker-button">Hapus</button>
          `;

          const deleteBtn = popupContainer.querySelector(
            ".delete-marker-button"
          );
          if (deleteBtn) {
            deleteBtn.onclick = () => {
              if (this.userMarker) {
                this.map.removeLayer(this.userMarker);
                this.userMarker = null;
              }
            };
          }

          this.userMarker.bindPopup(popupContainer).openPopup();
        },
        (error) => {
          alert(
            "Gagal mendapatkan lokasi Anda. Pastikan Anda memberikan izin lokasi."
          );
          console.error("Geolocation error:", error);
        }
      );
    } else {
      alert("Geolocation tidak didukung oleh browser Anda.");
    }
  }

  createColoredIcon(color) {
    const markerHtmlStyles = `
      background-color: ${color};
      width: 1.5rem;
      height: 1.5rem;
      display: block;
      left: -0.75rem;
      top: -0.75rem;
      position: relative;
      border-radius: 1.5rem 1.5rem 0;
      transform: rotate(45deg);
      border: 1px solid #FFFFFF`;

    return L.divIcon({
      className: "my-custom-pin",
      iconAnchor: [0, 24],
      popupAnchor: [0, -36],
      html: `<span style="${markerHtmlStyles}" />`,
    });
  }
}
