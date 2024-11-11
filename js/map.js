/* global L */
'use strict'

import { searchBar } from './searchBar.js'

function initializeMap () {
// Map image
  const image = './map/Zollstock-Modell.png'
  const boundy = 280
  const boundx = 1366.6
  const bounds = [[0, 0], [boundy, boundx]]

  // Create map
  const map = L.map('map', {
    zoomControl: false,
    crs: L.CRS.Simple,
    minZoom: 1,
    maxZoom: 3
  })

  // Add background image to map
  L.imageOverlay(image, bounds).addTo(map)

  map.setView([100, 645], 1)

  return map
}

const map = initializeMap()

searchBar(map)
