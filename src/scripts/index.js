import * as css from '../styles/styles.css';

const main = document.querySelector('main');
const navbar = document.getElementById('main-nav');
const menuToggle = document.getElementById('menu-toggle');

function renderView() {
    let hash = window.location.hash || '#/map';
    const footer = document.getElementById("site-footer");
  
    if (hash === "#/map") {
        if (footer) footer.style.display = "none";
      } else {
        if (footer) footer.style.display = "block";
      }

    document.startViewTransition(async() => {
        let view = null;
        let presenter = null;
        switch (hash) {
              case '#/map':
                const { MapView } = await import('./views/map-view.js');
                const { MapPresenter } = await import('./presenters/map-presenter.js');
                view = new MapView(main);
                presenter = new MapPresenter();
                break;
              case '#/credit':
                const { CreditView } = await import('./views/credit-view.js');
                const { CreditPresenter } = await import('./presenters/credit-presenter.js');
                view = new CreditView(main);
                presenter = new CreditPresenter();
                break;
                default:
                view = new NotFoundView(main);
                presenter = new NotFoundPresenter();
        }
        presenter.setView(view);
        view.setPresenter(presenter);
        presenter.onPageLoad();

        setTimeout(() => {
            gsap.fromTo(main, { opacity: 0 }, { opacity: 1, duration: 0.5 });
        });
    });
}

window.addEventListener('hashchange', renderView);
window.addEventListener('load', renderView);
window.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
        const isClickInsideNav = navbar.contains(e.target);
        const isClickOnToggle = menuToggle.contains(e.target);
        if (!isClickInsideNav && !isClickOnToggle) {
            navbar.classList.remove('show');
        }
    });
    
    // if ("serviceWorker" in navigator) {
    //     window.addEventListener("load", () => {
    //       navigator.serviceWorker.register("/sw.bundle.js").then(() => {
    //         console.log("Service Worker registered.");
    //       });
    //     });
    //   } else {
    //     console.log("Service Worker is not supported by this browser.");
    //   }
});