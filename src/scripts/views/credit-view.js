import "../../styles/credit-view.css";

export class CreditView {
  constructor(container) {
    this.container = container;
    this.presenter = null;
  }

  setPresenter(presenter) {
    this.presenter = presenter;
  }

  render() {
    this.container.innerHTML = `
 <div class="credit-container">
      <div class="credit-text max-w-2xl mx-auto">
          <p>Proyek WebGIS ini dikembangkan untuk mendukung penyediaan informasi spasial di 
          Padukuhan Jaban, Kalurahan Tridadi, Kabupaten Sleman, Daerah Istimewa Yogyakarta. 
          Pengembangan dan implementasi WebGIS ini merupakan hasil oleh <strong>Miftah Desma S.</strong>.</p>

              <p>Peta interaktif dibangun menggunakan 
              <a href="https://leafletjs.com/" target="_blank">Leaflet.js</a> 
              sebagai pustaka pemetaan berbasis web
              dan 
              <a href="https://webpack.js.org/" target="_blank">Webpack</a> 
              untuk modularisasi dan optimasi kode. Basemap yang digunakan
              mencakup 
              <a href="https://www.openstreetmap.org/#map=17/-7.723548/110.358798" target="_blank">OpenStreetMap</a>, 
              <a href="https://opentopomap.org/" target="_blank">OpenTopoMap</a>, dan 
              <a href="https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9" target="_blank">Esri World Imagery</a>. Data spasial administratif
              diperoleh dari 
              <a href="https://geoportal.slemankab.go.id/#/" target="_blank">Geoportal Sleman</a>,
              dan arsip Pemerintah Kalurahan Tridadi.</p>

          <p>WebGIS ini bertujuan untuk menyediakan peta interaktif administrasi Padukuhan Jaban yang memuat batas RT/RW serta titik lokasi rumah ketua RT dan RW. Dengan adanya WebGIS ini, 
          masyarakat, pemerintah desa, dan pemangku kepentingan lainnya dapat mengakses informasi tata wilayah secara 
          lebih mudah, interaktif, dan berbasis data spasial.</p>

      </div>
  </div>
    `;
  }
}
