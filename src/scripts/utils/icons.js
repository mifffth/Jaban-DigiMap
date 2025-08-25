import L from "leaflet";

export function createColoredIcon(color) {
  const styles = `
    background:${color};
    width:1.5rem;height:1.5rem;
    display:block;position:relative;
    border-radius:1.5rem 1.5rem 0;
    transform:rotate(45deg);
    border:1px solid #FFF;
  `;
  return L.divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    popupAnchor: [0, -36],
    html: `<span style="${styles}"></span>`,
  });
}
