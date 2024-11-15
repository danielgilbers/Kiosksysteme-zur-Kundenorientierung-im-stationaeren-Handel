/**
 * @jest-environment jsdom
 */

'use strict'

import L from 'leaflet'
import { addSearchBar, useSearchBar, sendSearchQuery } from './searchBar'
import { initializeMap } from './map'
import mockProducts from '../map/products.json'
import mockBausteine from '../map/bausteine.json'

global.fetch = jest.fn()
  .mockImplementation((url) => {
    if (url.includes('products')) {
      return Promise.resolve({
        json: () => Promise.resolve(mockProducts)
      })
    } else if (url.includes('bausteine')) {
      return Promise.resolve({
        json: () => Promise.resolve(mockBausteine)
      })
    }
  }
  )

const { initializeSearch } = require('./Product')

describe('Unittest F8: Globale Suchfunktion', () => {
  let map

  beforeAll(async () => {
    document.body.innerHTML = `
      <div class="d-flex flex-column h-100">
          <!-- Leaflet Map -->
          <div class="flex-grow-1" id="map"></div>
      </div>`
    map = initializeMap()
    await initializeSearch('fuse.js')
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
    const searchBarInput = document.getElementById('searchBarInput')
    const testValue = 'Gliedermaßsta'

    searchBarInput.value = testValue

    const event = new KeyboardEvent('keyup', { key: 'b' })

    expect(useSearchBar(event)).not.toBe(false)
  })

  test('Validierung einer leeren Eingabe', () => {
    const searchBarInput = document.getElementById('searchBarInput')
    const testValue = ''

    searchBarInput.value = testValue

    // Simuliere ein Keyup-Event mit der Enter-Taste
    const event = new KeyboardEvent('keyup', { key: 'Enter' })

    // Überprüfe, ob sendSearchQuery aufgerufen wurde
    expect(useSearchBar(event)).toBe(false)
  })

  test('Produktvorschläge nach Suche anzeigen', () => {
    const searchBarInput = document.getElementById('searchBarInput')
    const testValue = 'a'
    searchBarInput.value = testValue

    const event = new KeyboardEvent('keyup', { key: testValue })

    expect(document.getElementById('searchList')).toBeFalsy()

    useSearchBar(event)

    expect(document.getElementById('searchList')).toBeTruthy()
    expect(document.getElementById('searchList').childElementCount).toBeGreaterThan(1)
  })

  test('Suchleiste resetten', () => {
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
    const searchBarInput = document.getElementById('searchBarInput')
    const testValue = '?'
    searchBarInput.value = testValue
    let event = new KeyboardEvent('keyup', { key: testValue })
    useSearchBar(event)

    expect(document.getElementById('searchList')).toBeTruthy()
    expect(document.getElementById('searchList').childElementCount).toBe(1)
    expect(document.getElementById('noProductNotification')).toBeTruthy()

    event = new KeyboardEvent('keyup', { key: 'Enter' })
    useSearchBar(event)
  })

  test('Klick auf Suchergebnis', () => {
    const searchBarInput = document.getElementById('searchBarInput')
    const testValue = 'Akk'
    searchBarInput.value = testValue

    const searchEvent = new KeyboardEvent('keyup', { key: 'u' })

    useSearchBar(searchEvent)

    const productMarker = document.getElementsByClassName('leaflet-marker-icon')
    expect(productMarker[0]).toBeFalsy()

    document.getElementById('searchList').children[1].click()
    expect(productMarker[0]).toBeTruthy()
  })
})
