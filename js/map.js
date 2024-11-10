/* global L */
'use strict'

// Map image
const image = './map/Zollstock-Modell.png'
const boundy = 280
const boundx = 1366.6
const bounds = [[0, 0], [boundy, boundx]]

// Create map
const map = L.map('map', {
  zoomControl: true,
  crs: L.CRS.Simple,
  minZoom: -2,
  maxZoom: 3
})

// Add background image to map
L.imageOverlay(image, bounds).addTo(map)

map.setView([100, 645], 1)
