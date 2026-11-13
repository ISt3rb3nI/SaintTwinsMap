"use strict";

const statusLabel = document.querySelector("#map-status");
const fitButton = document.querySelector("#fit");
const metadata = window.saintTwinsMapData;

if (window.L && metadata) {
  const { width, height, tileSize, minZoom, maxZoom, format } = metadata;
  const map = L.map("map", {
    crs: L.CRS.Simple,
    minZoom: minZoom - 2,
    maxZoom,
    maxBoundsViscosity: 1,
    zoomSnap: 0.25,
    zoomControl: false
  });
  const bounds = L.latLngBounds(map.unproject([0, height], maxZoom), map.unproject([width, 0], maxZoom));
  const fit = () => map.fitBounds(bounds, { animate: false, padding: [12, 12] });

  L.control.zoom({
    zoomInTitle: "Приблизить",
    zoomOutTitle: "Отдалить"
  }).addTo(map);
  const tiles = L.tileLayer(`./tiles/{z}/{x}/{y}.${format}`, {
    bounds,
    tileSize,
    noWrap: true,
    minZoom: minZoom - 2,
    minNativeZoom: minZoom,
    maxNativeZoom: maxZoom,
    maxZoom,
    keepBuffer: 2,
    attribution: "Карта: ST-Map"
  });

  let failed = false;
  tiles.on("loading", () => {
    failed = false;
  }).on("tileerror", () => {
    failed = true;
    statusLabel.hidden = false;
    statusLabel.textContent = "Часть карты не загрузилась. Проверьте, что папка tiles находится рядом с index.html.";
  }).on("load", () => {
    if (!failed) {
      statusLabel.hidden = true;
    }
  });
  tiles.addTo(map);
  map.setMaxBounds(bounds);
  fit();
  fitButton.disabled = false;
  fitButton.addEventListener("click", fit);
} else {
  statusLabel.textContent = "Не удалось запустить карту. Проверьте, что открыта полная папка сайта.";
}
