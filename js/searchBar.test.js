/**
 * @jest-environment jsdom
 */

'use strict'

import L from 'leaflet'
import { searchBar, useSearchBar } from './searchBar'
import { initializeMap } from './map'

describe('Unittest F8: Globale Suchfunktion', () => {
  let map

  beforeAll(() => {
    document.body.innerHTML = `
      <div class="d-flex flex-column h-100">
          <!-- Leaflet Map -->
          <div class="flex-grow-1" id="map"></div>
      </div>`
    map = initializeMap()
    searchBar(map)
  })

  test('Eingabefeld am oberen Rand', () => {
    const searchBar = document.getElementById('searchBar')
    const searchBarInput = document.getElementById('searchBarInput')

    expect(searchBar).toBeTruthy()
    expect(searchBar.parentElement.classList.contains('leaflet-top')).toBe(true)

    expect(searchBarInput).toBeTruthy()
  })

  test('Validierung einer gültigen Eingabe', () => {
    const searchBarInput = document.getElementById('searchBarInput')
    const testValue = 'Hammer'

    searchBarInput.value = testValue

    // Simuliere ein Keyup-Event mit der Enter-Taste
    const event = new KeyboardEvent('keyup', { key: 'Enter' })

    // Überprüfe, ob sendSearchQuery aufgerufen wurde
    expect(useSearchBar(event)).toBe(testValue)
  })

  test('Validierung einer leeren Eingabe', () => {
    const searchBarInput = document.getElementById('searchBarInput')
    const testValue = ''

    searchBarInput.value = testValue

    // Simuliere ein Keyup-Event mit der Enter-Taste
    const event = new KeyboardEvent('keyup', { key: 'Enter' })

    // Überprüfe, ob sendSearchQuery aufgerufen wurde
    expect(useSearchBar(event)).toBe(null)
  })
})
