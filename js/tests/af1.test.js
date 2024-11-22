/**
 * @jest-environment jsdom
 */

'use strict'

import L from 'leaflet'
import { initializeMap } from '../map'

describe('Akzeptanztest AF1: 2D-Karte toom Zollstock', () => {
  beforeAll(() => {
    // HTML-Setup für die Karte
    document.body.innerHTML = `
      <div class="d-flex flex-column h-100">
        <div class="flex-grow-1" id="map"></div>
      </div>`

    // Initialisiere die Karte
    initializeMap()
  })

  test('Leaflet wird initialisiert und Karte angezeigt', () => {
    // Überprüfe, ob das Map-Element existiert
    const mapContainer = document.getElementById('map')
    expect(mapContainer).toBeTruthy()
    expect(mapContainer.classList.contains('leaflet-container')).toBe(true)

    // Überprüfe, ob Leaflet-Map initialisiert wurde
    const leafletMap = document.querySelector('.leaflet-container')
    expect(leafletMap).toBeTruthy()

    // Überprüfe, ob die Karte das Overlay-Image enthält
    const overlayElement = document.querySelector('.leaflet-image-layer')
    expect(overlayElement).toBeTruthy()
    expect(overlayElement.tagName).toBe('IMG')
    expect(overlayElement.src).toContain('/map/Zollstock-Modell.png')
  })
})
