/**
 * @jest-environment jsdom
 */

'use strict'

import L from 'leaflet'
import { initializeMap } from '../map'
import { addSearchBar } from '../searchBar'

import mockProducts from '../../map/products.json'
import mockBausteine from '../../map/bausteine.json'

const { initializeSearch } = require('../Product')

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

describe('Akzeptanztest AF8: Globale Suchfunktion', () => {
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
    expect(searchBar).toBeTruthy()
    expect(searchBar.parentElement.classList.contains('leaflet-top')).toBe(true)
  })

  test('gefundenes Produkt anzeigen', () => {
    const productMarker = document.getElementsByClassName('leaflet-marker-icon')
    expect(productMarker[0]).toBeFalsy()

    const searchBarInput = document.getElementById('searchBarInput')
    const testValue = 'Akku-Ladegerät'
    searchBarInput.value = testValue
    const event = new KeyboardEvent('keyup', { key: 'Enter' })
    searchBarInput.dispatchEvent(event)

    expect(productMarker[0]).toBeTruthy()
  })

  test('kein Produkt gefunden, Fehler anzeigen', () => {
    const searchBarInput = document.getElementById('searchBarInput')
    const testValue = '?'
    searchBarInput.value = testValue
    const event = new KeyboardEvent('keyup', { key: 'Enter' })
    searchBarInput.dispatchEvent(event)
    const noProductNotification = document.getElementById('noProductNotification')
    expect(noProductNotification).toBeTruthy()
    expect(noProductNotification.parentElement.id).toBe('searchList')
  })
})
