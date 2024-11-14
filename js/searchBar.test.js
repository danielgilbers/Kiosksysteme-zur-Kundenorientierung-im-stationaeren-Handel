/**
 * @jest-environment jsdom
 */

'use strict'

import L from 'leaflet'
import { addSearchBar, useSearchBar } from './searchBar'
import { initializeMap } from './map'

// Mock der Funktion searchProducts
jest.mock('./Product', () => {
  return {
    ...jest.requireActual('./Product'),
    searchProducts: jest.fn()
  }
})

const { searchProducts } = require('./Product')

describe('Unittest F8: Globale Suchfunktion', () => {
  let map

  beforeAll(() => {
    document.body.innerHTML = `
      <div class="d-flex flex-column h-100">
          <!-- Leaflet Map -->
          <div class="flex-grow-1" id="map"></div>
      </div>`
    map = initializeMap()
    addSearchBar(map)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Eingabefeld am oberen Rand', () => {
    const searchBar = document.getElementById('searchBar')
    const searchBarInput = document.getElementById('searchBarInput')

    expect(searchBar).toBeTruthy()
    expect(searchBar.parentElement.classList.contains('leaflet-top')).toBe(true)

    expect(searchBarInput).toBeTruthy()
  })

  test('Validierung einer gültigen Eingabe', () => {
    searchProducts.mockReturnValue([{ item: { artikel: 'TestProdukt' } }])
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

  test('Produktvorschläge nach Suche anzeigen', async () => {
    searchProducts.mockReturnValue([{ item: { artikel: 'TestProdukt' } }])

    const searchBarInput = document.getElementById('searchBarInput')
    const testValue = 'a'
    searchBarInput.value = testValue

    const event = new KeyboardEvent('keyup', { key: testValue })

    expect(document.getElementById('searchList')).toBeFalsy()

    useSearchBar(event)

    expect(searchProducts).toHaveBeenCalledWith(testValue)
    expect(document.getElementById('searchList')).toBeTruthy()
  })

  test('Suchleiste resetten', () => {
    searchProducts.mockReturnValue([{ item: { artikel: 'TestProdukt' } }])

    const searchBarInput = document.getElementById('searchBarInput')
    const testValue = 'a'
    searchBarInput.value = testValue
    let event = new KeyboardEvent('keyup', { key: testValue })
    useSearchBar(event)

    expect(document.getElementById('searchList')).toBeTruthy()

    searchBarInput.value = ''
    event = new KeyboardEvent('keyup', { key: 'Backspace' })
    useSearchBar(event)

    expect(document.getElementById('searchList')).toBeFalsy()
  })

  test('Fehlerbenachrichtigung', () => {
    searchProducts.mockReturnValue([])

    const searchBarInput = document.getElementById('searchBarInput')
    const testValue = 'a'
    searchBarInput.value = testValue
    let event = new KeyboardEvent('keyup', { key: testValue })
    useSearchBar(event)

    expect(document.getElementById('searchList')).toBeTruthy()
    expect(document.getElementById('noProductNotification')).toBeTruthy()

    event = new KeyboardEvent('keyup', { key: 'Enter' })
    useSearchBar(event)
  })
})
