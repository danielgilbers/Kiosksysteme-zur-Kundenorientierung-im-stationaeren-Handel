/**
 * @jest-environment jsdom
 */

'use strict'

import L from 'leaflet'
import { initializeMap } from '../map'

describe('Akzeptanztest AF1: 2D-Karte toom Zollstock', () => {
  beforeAll(() => {
    document.body.innerHTML = `
    <div class="d-flex flex-column h-100">
        <!-- Leaflet Map -->
        <div class="flex-grow-1" id="map"></div>
    </div>`
    initializeMap()
  })

  test('Leaflet wird initialisiert und Karte angezeigt', () => {
    // Überprüfe, ob Leaflet initialisiert wurde
    const mapContainer = document.getElementById('map')
    expect(mapContainer).toBeTruthy()
    expect(mapContainer.classList.contains('leaflet-container')).toBe(true)

    // Überprüfe, ob die Karte tatsächlich geladen wird
    const overlayElement = document.querySelector('.leaflet-image-layer')
    expect(overlayElement).toBeTruthy()
    expect(overlayElement.tagName).toBe('IMG')
    expect(overlayElement.src).toContain('/map/Zollstock-Modell.png')
  })
})
