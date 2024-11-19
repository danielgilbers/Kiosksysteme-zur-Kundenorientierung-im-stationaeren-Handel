/**
 * @jest-environment jsdom
 */

'use strict'

import L from 'leaflet'
import { addSearchBar, useSearchBar } from './searchBar'
import { initializeMap } from './map'
import mockProducts from '../map/products.json'
import mockBausteine from '../map/bausteine.json'

const { initializeSearch } = require('./Product')

describe('Unittest F8: Globale Suchfunktion', () => {
  let map

  beforeEach(async () => {
    // Fetch-Mock für Produkte und Bausteine
    global.fetch = jest.fn((url) => {
      if (url.includes('products')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockProducts)
        })
      } else if (url.includes('bausteine')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockBausteine)
        })
      }
    })

    document.body.innerHTML = `
      <div class="d-flex flex-column h-100">
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
    searchBarInput.value = 'Gliedermaßsta'
    const event = new KeyboardEvent('keyup', { key: 'b' })

    const result = useSearchBar(event)
    expect(result).not.toBe(false)
  })

  test('Validierung einer leeren Eingabe', () => {
    const searchBarInput = document.getElementById('searchBarInput')
    searchBarInput.value = ''
    const event = new KeyboardEvent('keyup', { key: 'Enter' })

    const result = useSearchBar(event)
    expect(result).toBe(false)
  })

  test('Produktvorschläge nach Suche anzeigen', () => {
    const searchBarInput = document.getElementById('searchBarInput')
    searchBarInput.value = 'a'
    const event = new KeyboardEvent('keyup', { key: 'a' })

    expect(document.getElementById('searchList')).toBeFalsy()
    useSearchBar(event)

    const searchList = document.getElementById('searchList')
    expect(searchList).toBeTruthy()
    expect(searchList.childElementCount).toBeGreaterThan(1)
  })

  test('Suchleiste zurücksetzen', () => {
    const searchBarInput = document.getElementById('searchBarInput')
    searchBarInput.value = 'a'
    let event = new KeyboardEvent('keyup', { key: 'a' })
    useSearchBar(event)

    expect(document.getElementById('searchList')).toBeTruthy()

    // Zurücksetzen
    searchBarInput.value = ''
    event = new KeyboardEvent('keyup', { key: 'Backspace' })
    useSearchBar(event)

    expect(document.getElementById('searchList')).toBeFalsy()
  })

  test('Fehlerbenachrichtigung', () => {
    const searchBarInput = document.getElementById('searchBarInput')
    searchBarInput.value = '?'
    const event = new KeyboardEvent('keyup', { key: '?' })

    useSearchBar(event)

    const searchList = document.getElementById('searchList')
    expect(searchList).toBeTruthy()
    expect(searchList.childElementCount).toBe(1)
    expect(document.getElementById('noProductNotification')).toBeTruthy()
  })

  test('Marker anzeigen', () => {
    const searchBarInput = document.getElementById('searchBarInput')
    searchBarInput.value = 'Akk'
    const searchEvent = new KeyboardEvent('keyup', { key: 'u' })

    useSearchBar(searchEvent)

    const searchList = document.getElementById('searchList')
    expect(searchList).toBeTruthy()

    const productMarker = document.getElementsByClassName('leaflet-marker-icon')
    expect(productMarker[0]).toBeFalsy()

    // Klick auf das Suchergebnis simulieren
    searchList.children[1].click()
    expect(productMarker[0]).toBeTruthy()
  })

  test('Alten Marker löschen', () => {
    const searchBarInput = document.getElementById('searchBarInput')
    searchBarInput.value = 'Akk'
    let searchEvent = new KeyboardEvent('keyup', { key: 'u' })

    useSearchBar(searchEvent)

    const searchList = document.getElementById('searchList')
    expect(searchList).toBeTruthy()

    const productMarker = document.getElementsByClassName('leaflet-marker-icon')
    expect(productMarker[0]).toBeFalsy()

    // Klick auf das erste Suchergebnis simulieren
    searchList.children[1].click()
    expect(productMarker[0]).toBeTruthy()

    const oldProductMarker = { ...productMarker }

    searchBarInput.value = 'Ate'
    searchEvent = new KeyboardEvent('keyup', { key: 'm' })

    useSearchBar(searchEvent)

    // Klick auf das zweite Suchergebnis simulieren
    searchList.children[1].click()
    expect(productMarker[0]).toBeTruthy()
    expect(productMarker[0].style).not.toEqual(oldProductMarker[0].style)
  })

  test('X Symbol anzeigen und entfernen', () => {
    const searchBarInput = document.getElementById('searchBarInput')
    searchBarInput.value = 'a'
    let event = new KeyboardEvent('keyup', { key: 'a' })
    useSearchBar(event)

    expect(document.getElementById('clearGroup')).toBeTruthy()

    // Zurücksetzen
    searchBarInput.value = ''
    event = new KeyboardEvent('keyup', { key: 'Backspace' })
    useSearchBar(event)

    expect(document.getElementById('clearGroup')).toBeFalsy()
  })
})
