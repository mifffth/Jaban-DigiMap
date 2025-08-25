import L from "leaflet";

export function addLocationControl(map, onLocate) {
  const LocationControl = L.Control.extend({
    options: { position: "topleft" },
    onAdd: () => {
      const button = L.DomUtil.create("button", "leaflet-bar");
      button.innerHTML = '<i class="fa-solid fa-location-dot" style="font-size:19px;"></i>';
      button.style.background = "white";
      button.onclick = (e) => {
        e.stopPropagation();
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            pos => onLocate([pos.coords.latitude, pos.coords.longitude]),
            () => alert("Gagal mendapatkan lokasi Anda.")
          );
        }
      };
      return button;
    }
  });
  map.addControl(new LocationControl());
}

export function addLegend(map) {
  const legend = L.control({ position: "bottomleft" });
  legend.onAdd = () => {
    const div = L.DomUtil.create("div", "info legend");
    div.style.cssText = "background:white;padding:6px;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.2);font-size:12px;";
    div.innerHTML = `<b>Legenda</b><br>
      <i style="background:#33cc33;width:12px;height:12px;display:inline-block;margin-right:4px;"></i>Ketua Padukuhan<br>
      <i style="background:#ff6600;width:12px;height:12px;display:inline-block;margin-right:4px;"></i>Ketua RT<br>
      <i style="background:#3366ff;width:12px;height:12px;display:inline-block;margin-right:4px;"></i>Ketua RW<br>`;
    return div;
  };
  legend.addTo(map);
}
