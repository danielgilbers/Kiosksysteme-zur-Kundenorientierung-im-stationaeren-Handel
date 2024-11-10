/**
 * @jest-environment jsdom
 */

'use strict'

import L from 'leaflet'

describe('Akzeptanztest AF1: 2D-Karte toom Zollstock', () => {
  beforeAll(() => {
    document.body.innerHTML = '<div class="flex-grow-1" id="map"></div>'
  })

  test('Leaflet wird initialisiert und Karte angezeigt', () => {
    require('../map')

    // Überprüfe, ob die Leaflet-Karte initialisiert wurde
    const mapContainer = document.getElementById('map')
    expect(mapContainer).toBeTruthy()
    expect(mapContainer.classList.contains('leaflet-container')).toBe(true)

    // Überprüfe, ob das Karte tatsächlich geladen wird
    const overlayElement = document.querySelector('.leaflet-image-layer')
    expect(overlayElement).toBeTruthy()
    expect(overlayElement.tagName).toBe('IMG')
    expect(overlayElement.src).toContain('/map/Zollstock-Modell.png')
  })
})
