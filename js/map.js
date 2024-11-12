/* global L */
'use strict'

export function initializeMap () {
// Map image
  const image = './map/Zollstock-Modell.png'
  const boundy = 280
  const boundx = 1366.6
  const bounds = [[0, 0], [boundy, boundx]]

  // Create map
  const map = L.map('map', {
    zoomControl: false,
    crs: L.CRS.Simple,
    minZoom: 0,
    maxZoom: 3
  })

  // Add background image to map
  L.imageOverlay(image, bounds).addTo(map)

  map.setView([150, 675], 1)

  return map
}
