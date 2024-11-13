/**
 * @jest-environment jsdom
 */

'use strict'

import L from 'leaflet'
import { initializeMap } from '../map'
import { addSearchBar } from '../searchBar'

describe('Akzeptanztest AF8: Globale Suchfunktion', () => {
  beforeAll(() => {
    document.body.innerHTML = `
      <div class="d-flex flex-column h-100">
          <!-- Leaflet Map -->
          <div class="flex-grow-1" id="map"></div>
      </div>`
    map = initializeMap()
    addSearchBar(map)
  })

  test('Eingabefeld am oberen Rand', () => {
    const searchBar = document.getElementById('searchBar')
    expect(searchBar).toBeTruthy()
    expect(searchBar.parentElement.classList.contains('leaflet-top')).toBe(true)
  })

  test('gefundenes Produkt anzeigen', () => {
    const productMarker = document.getElementById('productMarker')
    expect(productMarker).toBeTruthy()
  })

  test('kein Produkt gefunden, Fehler anzeigen', () => {
    const noProductNotification = document.getElementById('noProductNotification')
    expect(noProductNotification).toBeTruthy()
    expect(noProductNotification.parentElement.classList.contains('leaflet-top')).toBe(true)
  })
})
