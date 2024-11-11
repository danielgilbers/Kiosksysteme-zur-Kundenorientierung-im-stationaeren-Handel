/**
 * @jest-environment jsdom
 */

'use strict'

import L from 'leaflet'

describe('Unittest F8: Globale Suchfunktion', () => {
  beforeAll(() => {
    document.body.innerHTML = `
        <div class="d-flex flex-column h-100">
            <!-- Leaflet Map -->
            <div class="flex-grow-1" id="map"></div>
        </div>`
    require('./map')
  })

  test('Eingabefeld am oberen Rand', () => {
    const searchBar = document.getElementById('searchBar')
    expect(searchBar).toBeTruthy()
    expect(searchBar.parentElement.classList.contains('leaflet-top')).toBe(true)
  })
})
