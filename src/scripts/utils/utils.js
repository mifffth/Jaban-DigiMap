export function saveMapView(map) {
    const center = map.getCenter();
    const zoom = map.getZoom();
    sessionStorage.setItem("mapView", JSON.stringify({ center: [center.lat, center.lng], zoom }));
  }
  
  export function restoreMapView() {
    const savedView = sessionStorage.getItem("mapView");
    if (savedView) return JSON.parse(savedView).center;
    return null;
  }
  