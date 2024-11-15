/**
 * @jest-environment jsdom
 */

'use strict'

import L from 'leaflet'
import { initializeMap } from '../map'

describe('Akzeptanztest AF1: 2D-Karte toom Zollstock', () => {
  let mapContainer

  beforeEach(() => {
    // HTML-Setup für die Karte
    document.body.innerHTML = `
      <div class="d-flex flex-column h-100">
        <div class="flex-grow-1" id="map"></div>
      </div>`
    mapContainer = document.getElementById('map')
  })

  afterEach(() => {
    jest.clearAllMocks()
    document.body.innerHTML = '' // Aufräumen des DOMs
  })

  test('Leaflet wird initialisiert und Karte angezeigt', () => {
    // Initialisiere die Karte
    initializeMap()
    // Überprüfe, ob das Map-Element existiert
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

  test('Leaflet-Methoden aufrufen', () => {
    // Spionieren auf Leaflet-Methoden
    const mapSpy = jest.spyOn(L, 'map')
    const tileLayerSpy = jest.spyOn(L, 'imageOverlay')

    // Karte erneut initialisieren
    initializeMap()

    // Sicherstellen, dass die Leaflet-Methoden aufgerufen wurden
    expect(mapSpy).toHaveBeenCalledTimes(1)
    expect(tileLayerSpy).toHaveBeenCalled()

    mapSpy.mockRestore()
    tileLayerSpy.mockRestore()
  })
})
