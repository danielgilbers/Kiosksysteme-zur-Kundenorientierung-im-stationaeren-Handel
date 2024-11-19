/* global L */
'use strict'

import { findPosition, searchProducts } from './Product.js'

let map, searchBar, searchGroup, searchButton, searchBarInput, previousMarker

const searchList = L.DomUtil.create('div', 'list-group list-group-flush pe-3')
searchList.id = 'searchList'

/**
 * Search bar
 */
L.Control.Search = L.Control.extend({
  onAdd: function () {
    this.container = L.DomUtil.create('div', 'rounded-start-5 rounded-end-5 px-3 py-2 position-absolut start-50 translate-middle-x shadow-sm w-75 searchBar')
    this.container.id = 'searchBar'
    this.container.innerHTML =
      '<div class="input-group d-flex" id="searchGroup">' +
      '<input id="searchBarInput" type="text" class="form-control border-0 p-0" placeholder="Was suchst du?" aria-label="Suchen" aria-describedby="addon-wrapping" autocomplete="off">' +
      '<button id="searchButton" class="btn btn-sm lh-1 border-0">' +
      '<span class="material-symbols-outlined">Search</span>' +
      '</button>' +
      '</div>'
    return this.container
  }
})

const clearGoup = L.DomUtil.create('div', 'clearGroup')
clearGoup.id = 'clearGroup'
clearGoup.innerHTML = '<button id="clearButton" class="btn btn-sm lh-1 border-0"><span class="material-symbols-outlined mb-sm">Close</span></button><span class="seperator align-middle"></span>'

export function addSearchBar (thisMap) {
  map = thisMap
  new L.Control.Search({ position: 'topleft' }).addTo(map)
  searchBar = document.getElementById('searchBar')

  searchBarInput = document.getElementById('searchBarInput')
  searchBarInput.addEventListener('keyup', useSearchBar)

  searchGroup = document.getElementById('searchGroup')

  searchButton = document.getElementById('searchButton')
  searchButton.addEventListener('click', function () { sendSearchQuery() })

  searchBar.addEventListener('click', function (e) { e.stopPropagation() })
  searchBar.addEventListener('dblclick', function (e) { e.stopPropagation() })
  searchBar.addEventListener('mousedown', function (e) { e.stopPropagation() }, { passive: true })
  searchBar.addEventListener('touchstart', function (e) { e.stopPropagation() }, { passive: true })
}

export function useSearchBar (e) {
  const inputValue = searchBarInput.value
  if (!inputValue) {
    resetSearchBar()
    return false
  }
  addClearButton()
  expandSearchBar(inputValue)
  if (e.key === 'Enter') {
    sendSearchQuery()
  }
}

function addClearButton () {
  if (!document.getElementById('clearGroup')) {
    searchGroup.insertBefore(clearGoup, searchButton)
    document.getElementById('clearButton').addEventListener('click', resetSearchBar)
  }
}

export function sendSearchQuery (query) {
  const inputValue = query ?? searchBarInput.value
  const searchResult = searchProducts(inputValue)
  if (searchResult.length > 0) {
    removeSearchList()
    const firstItem = searchResult[0].item
    searchBarInput.value = firstItem.artikel
    removeOldMarker()
    const marker = new L.marker(findPosition(firstItem))
    marker.id = 'productMarker'
    marker.addTo(map)
    previousMarker = marker
  }
}

function removeOldMarker () {
  if (previousMarker) { previousMarker.remove() }
}

function resetSearchBar () {
  removeSearchList()
  removeOldMarker()
  searchBarInput.value = ''
  if (document.getElementById('clearGroup')) { document.getElementById('clearGroup').remove() }
}

function removeSearchList () {
  if (searchBar.contains(searchList)) {
    searchBar.removeChild(searchList)
  }
}

function expandSearchBar (inputValue) {
  if (searchProducts(inputValue).length === 0) {
    searchList.innerHTML = '<p class="text-body-secondary m-2 ms-3 fw-semibold" id="noProductNotification">Leider finden wir keine Ergebnisse für deinen Suchbegriff.</p>'
  } else {
    searchList.innerHTML = '<p class="text-body-secondary m-2 ms-3 fw-semibold text-uppercase">Produkte</p>'

    for (const p of searchProducts(inputValue)) {
      searchList.innerHTML += '<button type="button" class="list-group-item list-group-item-action" onclick="search(\'' + p.item.artikel + '\')">' + p.item.artikel + '</button>'
    }
  }

  if (!document.getElementById('searchList')) {
    searchBar.appendChild(searchList)
  }
}

window.search = (query) => {
  sendSearchQuery(query)
}
