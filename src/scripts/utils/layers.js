import L from "leaflet";

export async function loadMapLayers(map, baseLayers, createColoredIcon) {
  const layersControl = L.control.layers(baseLayers, {}, { position: "topright", collapsed: true }).addTo(map);

  const rtColorPalette = {
    1: "#f7c8f9", 2: "#fdc5c5", 3: "#c5f3fd",
    4: "#c5fdc5", 5: "#d8c5fd", 6: "#fdeac5",
  };

  try {
    const [padukuhanData, rtData, rtrwData] = await Promise.all([
      fetch("./data/Jaban.geojson").then(res => res.json()),
      fetch("./data/RT_Jaban.geojson").then(res => res.json()),
      fetch("./data/RTRW_Jaban_Pt.geojson").then(res => res.json())
    ]);

    const padukuhanLayer = L.geoJSON(padukuhanData, {
      style: { color: "#00cccc", weight: 3, opacity: 1, fillOpacity: 0.5 },
      onEachFeature: (feature, layer) => {
        layer.bindPopup("Padukuhan " + feature.properties?.Padukuhan);
      }
    }).addTo(map);

    const rtLayer = L.geoJSON(rtData, {
      style: f => {
        const rtId = f.properties.RT;
        const color = rtColorPalette[rtId] || "#cccccc";
        return { color, weight: 2, fillColor: color, fillOpacity: 0.7 };
      },
      onEachFeature: (f, layer) => {
        if (f.properties?.RT) layer.bindPopup(`<b>RT ${f.properties.RT}</b>`);
      }
    }).addTo(map);

    const tipeColors = { RT: "#ff6600", RW: "#3366ff", "Ketua Dukuh": "#33cc33" };
    const rtrwLayer = L.geoJSON(rtrwData, {
      pointToLayer: (f, latlng) => {
        const tipe = f.properties?.Tipe || "RT";
        return L.marker(latlng, { icon: createColoredIcon(tipeColors[tipe] || "#999") });
      },
      onEachFeature: (f, layer) => {
        const tipe = f.properties?.RTRW || "N/A";
        const nama = f.properties?.Nama || "Tidak diketahui";
        const lat = f.properties?.Latitude, lng = f.properties?.Longitude;
        let gmapsLink = "";
        if (lat && lng) gmapsLink = `<br><a href="https://www.google.com/maps?q=${lat},${lng}" target="_blank">📍 Google Maps</a>`;
        layer.bindPopup(`<b>Tipe:</b> ${tipe}<br><b>Nama:</b> ${nama}${gmapsLink}`);
      }
    }).addTo(map);

    layersControl.addOverlay(rtrwLayer, "Ketua RT/RW");
    layersControl.addOverlay(rtLayer, "Batas RT/RW");
  } catch (err) {
    console.error("Error loading GeoJSON:", err);
  }
}
